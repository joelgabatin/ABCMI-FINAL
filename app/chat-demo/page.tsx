import ChurchChatbot from '@/components/chatbot/church-chatbot'
import { SiteLayout } from '@/components/layout/site-layout'

export default function ChatDemoPage() {
  return (
    <SiteLayout showChatbot={false}>
      <section className="bg-[var(--church-light-blue)]/35 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold text-foreground">Chat With Grace</h1>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Example page integration for the reusable chatbot component. This embedded
                version uses the same stable browser sender ID and posts only
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
                  sender
                </code>
                and
                <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-sm">
                  message
                </code>
                to your chatbot API.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <ChurchChatbot variant="embedded" />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
