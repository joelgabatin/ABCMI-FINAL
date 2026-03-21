import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, User, Tag, Image as ImageIcon } from "lucide-react"

const newsArticles = [
  {
    title: "New Church Building Project Update: Fellowship Hall Construction at 60%",
    date: "March 10, 2026",
    author: "ABCMI Communications Team",
    category: "Announcement",
    featured: true,
    excerpt: "We are thrilled to announce that the construction of our new Fellowship Hall at the East Quirino Hill main campus has reached the 60% completion milestone. Thanks to the generous giving of our congregation and special donors, the project remains on schedule for a December 2026 dedication.",
    body: "The new 500-seat Fellowship Hall will serve as a multipurpose space for large gatherings, conferences, and community outreach programs. The groundbreaking was held in January 2025, and the structural work is now complete. Interior finishing, electrical work, and acoustic treatment will begin next month. We thank every member who has contributed to the Building Fund and continue to invite your partnership through prayer and giving. An updated 3D rendering of the completed building is available on the church notice board.",
    tags: ["Building Fund", "Construction", "Announcement"],
  },
  {
    title: "Missions Team Returns from Vientiane, Laos with Encouraging Report",
    date: "March 5, 2026",
    author: "Ptr. Ysrael Coyoy",
    category: "Missions Update",
    featured: false,
    excerpt: "Our missions team led by Ptr. Emannuel Marbella has returned from their latest visit to our partner church in Vientiane, Laos. The team reports that the congregation has grown to over 30 regular attendees, with 8 new believers baptized.",
    body: "The ABCMI Laos mission has been active since 2018 and continues to bear fruit in one of Southeast Asia's most restricted mission fields. During the recent visit, the team conducted leadership training for local church workers, distributed Bibles and study materials, and held three evangelistic home meetings. Ptr. Emannuel reports that despite challenges, the local believers are growing in faith and commitment. The team's next visit is scheduled for the second quarter of 2026. Please continue to pray for the Laos mission and consider supporting it through the Missions Fund.",
    tags: ["Missions", "Laos", "Church Growth"],
  },
  {
    title: "ABCMI Launches New 12-Week Discipleship Program for New Believers",
    date: "February 28, 2026",
    author: "Ptr. Marvin Anno",
    category: "Ministry News",
    featured: false,
    excerpt: "The Discipleship Group Ministry is excited to announce the launch of a new structured 12-week discipleship program designed specifically for new believers and those returning to faith.",
    body: "The 'ROOTED' discipleship program covers the foundational truths of the Christian faith, including salvation, prayer, Bible study, water baptism, Holy Spirit baptism, the church, and Christian living. Classes will be held every Tuesday evening at 6:30 PM in Room 3 of the main church. The program is facilitated by trained discipleship group leaders under the oversight of Ptr. Marvin Anno. Pre-registration is required and is available through our Bible Study page or at the church office. The first cohort begins April 1, 2026, with a cap of 25 participants.",
    tags: ["Discipleship", "New Believers", "Program"],
  },
  {
    title: "ABCMI Dianawan Branch Celebrates 10th Anniversary",
    date: "February 14, 2026",
    author: "Ptr. Mirriam Anno",
    category: "Branch News",
    featured: false,
    excerpt: "Our Dianawan, Maria Aurora, Aurora branch celebrated its 10th founding anniversary last Sunday with a special service attended by more than 120 members and guests from neighboring communities.",
    body: "The Dianawan branch was planted in 2016 by Ptr. Marvin and Ptr. Mirriam Anno as part of ABCMI's rural church planting initiative in the Aurora province. What began as a small home Bible study has grown into a vibrant congregation with regular Sunday services, a children's ministry, and a youth group. The anniversary service featured testimonies from founding members, a special choir presentation, and a message by Ptr. Ysrael Coyoy. The branch is currently constructing a dedicated worship space with community support.",
    tags: ["Branch News", "Anniversary", "Aurora"],
  },
  {
    title: "Reflections on 40 Years: A Message from Our Senior Pastor",
    date: "November 8, 2025",
    author: "Ptr. Ysrael Coyoy",
    category: "Pastor's Message",
    featured: false,
    excerpt: "As we celebrate ABCMI's 40th anniversary, I want to look back with gratitude and look forward with faith. God has been faithful beyond what we could have asked or imagined in 1984.",
    body: "When Rev. Marino S. Coyoy and Elizabeth L. Coyoy founded Arise and Build for Christ Ministries in 1984 in Baguio City, they carried a simple but powerful vision: to build God's people as living stones in His kingdom. From a small house church in East Quirino Hill, God has grown us into a network of 13 branches spanning Baguio City, Abra, Benguet, Nueva Vizcaya, Aurora, and even Vientiane, Laos. As your pastor, I stand in awe of what God has done and remain committed to the mission, vision, and values that have guided us for four decades. To God be all the glory.",
    tags: ["Anniversary", "Pastoral Message", "History"],
  },
  {
    title: "ABCMI Partners with Local Government for Community Feeding Program",
    date: "October 22, 2025",
    author: "ABCMI Health Ministry",
    category: "Community",
    featured: false,
    excerpt: "ABCMI's Health Ministry has entered into a partnership with the Baguio City Social Welfare Office to conduct a monthly feeding program for malnourished children in three identified barangays.",
    body: "The program, which began in October 2025, targets 50 underweight children aged 3–12 in Barangays Quirino Hill, Engineers Hill, and Fairview. Meals are prepared by Health Ministry volunteers every last Saturday of the month and are supplemented with vitamins and health monitoring. The partnership allows ABCMI to extend its community service reach while sharing the love of Christ in practical ways. Volunteers are welcome — contact Ptr. Rosel Montero or the church office to sign up.",
    tags: ["Community", "Health Ministry", "Feeding Program"],
  },
]

const categoryColors: Record<string, string> = {
  Announcement: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  "Missions Update": "bg-blue-500/10 text-blue-700",
  "Ministry News": "bg-emerald-500/10 text-emerald-700",
  "Branch News": "bg-orange-500/10 text-orange-700",
  "Pastor's Message": "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Community: "bg-purple-500/10 text-purple-700",
}

export default function NewsBlogPage() {
  const featured = newsArticles.find((a) => a.featured)
  const rest = newsArticles.filter((a) => !a.featured)

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Tag className="w-4 h-4" />
              News &amp; Blog
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Church News &amp; Updates</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Stay informed about what God is doing through ABCMI — from local outreach to global missions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Featured article — full width */}
            {featured && (
              <Card className="w-full bg-background border-none shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-96 h-64 lg:h-auto bg-[var(--church-soft-gray)] flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-14 h-14 text-muted-foreground/30" />
                    </div>
                    <div className="flex-1 p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className={`${categoryColors[featured.category] || "bg-muted text-muted-foreground"}`}>
                          {featured.category}
                        </Badge>
                        <span className="px-2.5 py-1 bg-[var(--church-gold)] text-[var(--church-dark-text)] rounded-full text-xs font-bold">Featured</span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 text-balance">{featured.title}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{featured.date}</span>
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{featured.author}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{featured.excerpt}</p>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-6 text-pretty">{featured.body}</p>
                      <div className="flex flex-wrap gap-2">
                        {featured.tags.map((tag, t) => (
                          <span key={t} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <h2 className="text-2xl font-bold text-foreground">More News &amp; Updates</h2>

            {/* Rest of articles — each full width */}
            <div className="space-y-5">
              {rest.map((article, i) => (
                <Card key={i} className="w-full bg-background border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Thumbnail */}
                      <div className="lg:w-48 h-40 lg:h-32 bg-[var(--church-soft-gray)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={categoryColors[article.category] || "bg-muted text-muted-foreground"}>
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />{article.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <User className="w-3 h-3" />{article.author}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 text-balance">{article.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {article.tags.map((tag, t) => (
                              <span key={t} className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <Button variant="ghost" className="text-[var(--church-primary)] hover:text-[var(--church-primary-deep)] text-sm h-auto p-0 gap-1">
                            Read more <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
