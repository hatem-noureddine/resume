import { encrypt, decrypt, createSession, getSession, deleteSession, updateSession, SESSION_COOKIE } from './auth';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Mock dependencies
jest.mock('jose', () => ({
    SignJWT: jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mock-token'),
    })),
    jwtVerify: jest.fn(),
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

jest.mock('next/server', () => {
    const ActualNextResponse = jest.requireActual('next/server').NextResponse;
    return {
        NextRequest: jest.fn(),
        NextResponse: {
            ...ActualNextResponse,
            next: jest.fn().mockReturnValue({
                cookies: {
                    set: jest.fn(),
                },
            }),
        },
    };
});

describe('auth utility', () => {
    const mockCookieStore = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
    });

    describe('encrypt', () => {
        it('should encrypt payload', async () => {
            const payload = { role: 'admin', expiresAt: new Date() };
            const token = await encrypt(payload);
            expect(token).toBe('mock-token');
            expect(SignJWT).toHaveBeenCalled();
        });
    });

    describe('decrypt', () => {
        it('should decrypt valid token', async () => {
            const payload = { role: 'admin' };
            (jwtVerify as jest.Mock).mockResolvedValue({ payload });

            const result = await decrypt('valid-token');
            expect(result).toEqual(payload);
        });

        it('should return null for invalid token', async () => {
            (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid'));

            const result = await decrypt('invalid-token');
            expect(result).toBeNull();
        });
    });

    describe('createSession', () => {
        it('should create session cookie', async () => {
            await createSession('admin');

            expect(mockCookieStore.set).toHaveBeenCalledWith(
                SESSION_COOKIE,
                'mock-token',
                expect.objectContaining({
                    httpOnly: true,
                    path: '/',
                })
            );
        });
    });

    describe('getSession', () => {
        it('should return session if cookie exists', async () => {
            mockCookieStore.get.mockReturnValue({ value: 'valid-token' });
            (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: 'admin' } });

            const session = await getSession();
            expect(session).toEqual({ role: 'admin' });
        });

        it('should return null if no cookie', async () => {
            mockCookieStore.get.mockReturnValue(undefined);

            const session = await getSession();
            expect(session).toBeNull();
        });
    });

    describe('deleteSession', () => {
        it('should delete session cookie', async () => {
            await deleteSession();
            expect(mockCookieStore.delete).toHaveBeenCalledWith(SESSION_COOKIE);
        });
    });

    describe('updateSession', () => {
        it('should update session expiration if valid session exists', async () => {
            const mockRequest = {
                cookies: {
                    get: jest.fn().mockReturnValue({ value: 'valid-token' }),
                },
            } as unknown as NextRequest;

            (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: 'admin', expiresAt: new Date() } });

            const res = await updateSession(mockRequest);

            expect(NextResponse.next).toHaveBeenCalled();
            expect(res?.cookies.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: SESSION_COOKIE,
                    value: 'mock-token',
                })
            );
        });

        it('should do nothing if no session cookie', async () => {
            const mockRequest = {
                cookies: {
                    get: jest.fn().mockReturnValue(undefined),
                },
            } as unknown as NextRequest;

            await updateSession(mockRequest);
            expect(NextResponse.next).not.toHaveBeenCalled();
        });

        it('should do nothing if session is invalid', async () => {
            const mockRequest = {
                cookies: {
                    get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
                },
            } as unknown as NextRequest;

            (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid'));

            await updateSession(mockRequest);
            expect(NextResponse.next).not.toHaveBeenCalled();
        });
    });
});
