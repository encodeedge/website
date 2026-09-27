export const prerender = false;
import type { APIRoute } from 'astro';
import { 
  signCertificatePayload, 
  buildVerifiedCertificateUrl,
  type CertificateSigningPayload 
} from '@/lib/certificate-security';

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { 
      courseId, 
      courseTitle, 
      studentName, 
      certId: requestedCertId, 
      issueDate: requestedDate,
      grade = 'With Distinction'
    } = body;

    // 1. Validation
    if (!courseId || typeof courseId !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid courseId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const trimmedName = (studentName || '').trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return new Response(JSON.stringify({ error: 'Student name must be between 2 and 100 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Basic sanitization against injection
    if (/[<>{}]/.test(trimmedName)) {
      return new Response(JSON.stringify({ error: 'Special characters < > { } are not allowed in recipient name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const issueDate = requestedDate || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const certId = requestedCertId || 
      `EE-${courseId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    // 2. Cryptographic Signing with server-side private key
    const payload: CertificateSigningPayload = {
      certId,
      studentName: trimmedName,
      courseId,
      issueDate,
      grade,
    };

    const signature = await signCertificatePayload(payload);
    const origin = url.origin || 'https://encodeedge.com';
    const verifyUrl = buildVerifiedCertificateUrl(origin, payload, signature);

    return new Response(JSON.stringify({
      success: true,
      certId,
      signature,
      studentName: trimmedName,
      courseId,
      courseTitle: courseTitle || courseId,
      issueDate,
      grade,
      verifyUrl,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[API Issue Certificate] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error while generating certificate signature' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
