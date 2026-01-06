import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: '아이디와 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);

        if (isMatch) {
            const response = NextResponse.json({ success: true });

            // Set a simple session cookie
            response.cookies.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
