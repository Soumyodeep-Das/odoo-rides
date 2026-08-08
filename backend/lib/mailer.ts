import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_KEY)

const inviteHtml = (name: string, magicLink: string) => `
  <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
    <div style="margin-bottom:24px">
      <span style="font-size:20px;font-weight:800;letter-spacing:2px;color:#fff">ODOO RIDES</span>
    </div>
    <h2 style="color:#fff;font-size:24px;margin:0 0 12px">Welcome aboard, ${name}!</h2>
    <p style="color:#94a3b8;margin:0 0 24px">
      Your admin has added you to the platform. Click the button below to set up your account and start commuting.
    </p>
    <a href="${magicLink}"
       style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
      Set up my account →
    </a>
    <p style="color:#64748b;font-size:12px;margin-top:32px">
      This link expires in <strong>24 hours</strong>. If you did not expect this email, you can safely ignore it.
    </p>
    <p style="color:#64748b;font-size:11px">
      Or copy: <a href="${magicLink}" style="color:#818cf8">${magicLink}</a>
    </p>
  </div>
`

export async function sendInviteEmail(to: string, name: string, magicLink: string) {
  const { error } = await resend.emails.send({
    from: 'OdooRides <onboarding@resend.dev>',
    to,
    subject: `You've been invited to OdooRides`,
    html: inviteHtml(name, magicLink),
  })

  if (error) {
    throw new Error(`Failed to send invite email: ${error.message}`)
  }
}
