import { useState } from "react";

const PASSCODE = "10623";

export default function Cygnet() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("cygnet-auth") === "true"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem("cygnet-auth", "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
          .cygnet-gate, .cygnet-gate * { font-family: 'Montserrat', sans-serif !important; }
        `}</style>
        <div className="cygnet-gate text-center">
          <div style={{ background: "#1B3A5C", borderRadius: 14, padding: "40px 48px", maxWidth: 400 }}>
            <h2 style={{ fontSize: 28, color: "white", marginBottom: 8, fontWeight: 600 }}>Cygnet Institute</h2>
            <p style={{ fontSize: 16, color: "#a3c0d6", marginBottom: 28 }}>Enter passcode to view this report</p>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                placeholder="Passcode"
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 18,
                  borderRadius: 8,
                  border: error ? "2px solid #c0392b" : "2px solid #2E8B8B",
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: 4,
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
              />
              {error && <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 12 }}>Incorrect passcode</p>}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  background: "#2E8B8B",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cygnet-page, .cygnet-page * { font-family: 'DM Sans', sans-serif !important; margin: 0; padding: 0; box-sizing: border-box; }
        .cygnet-page { background: #faf9f7; color: #2a2a2a; line-height: 1.65; -webkit-font-smoothing: antialiased; }

        .cygnet-page .hero { background: #1B3A5C; padding: 48px 24px 44px; text-align: center; position: relative; overflow: hidden; }
        .cygnet-page .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #2E8B8B, #3AAFAF, #E8A838); }
        .cygnet-page .hero h1 { font-family: 'DM Serif Display', serif !important; font-size: 42px; color: white; margin-bottom: 10px; font-weight: 400; }
        .cygnet-page .hero p { font-size: 19px; color: #a3c0d6; max-width: 620px; margin: 0 auto; }
        .cygnet-page .hero .tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px; }
        .cygnet-page .hero .tag { display: inline-block; padding: 7px 18px; background: rgba(46,139,139,0.2); border: 1px solid rgba(46,139,139,0.35); border-radius: 20px; font-size: 14px; font-weight: 600; color: #7dd4d4; letter-spacing: 0.4px; text-transform: uppercase; }

        .cygnet-page .wrap { max-width: 820px; margin: 0 auto; padding: 40px 24px 72px; }

        .cygnet-page .section-label { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2E8B8B; margin: 40px 0 14px; display: flex; align-items: center; gap: 10px; }
        .cygnet-page .section-label .line { flex: 1; height: 1px; background: #ddd; }

        .cygnet-page .card { background: white; border-radius: 12px; padding: 28px; margin-bottom: 16px; border: 1px solid #e8e4df; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
        .cygnet-page .card h3 { font-size: 21px; font-weight: 700; color: #1B3A5C; margin-bottom: 8px; }
        .cygnet-page .card p { font-size: 18px; color: #555; }
        .cygnet-page .card p + p { margin-top: 10px; }
        .cygnet-page .card .meta { font-size: 15px; color: #888; font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

        .cygnet-page .pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 18px 0 28px; }
        @media (max-width: 540px) { .cygnet-page .pillars { grid-template-columns: 1fr; } }
        .cygnet-page .pillar { background: white; border-radius: 10px; padding: 22px; border: 1px solid #e8e4df; text-align: center; }
        .cygnet-page .pillar .icon { font-size: 32px; margin-bottom: 8px; }
        .cygnet-page .pillar h4 { font-size: 18px; font-weight: 700; color: #1B3A5C; margin-bottom: 6px; }
        .cygnet-page .pillar p { font-size: 16px; color: #666; }

        .cygnet-page .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 18px 0 28px; }
        .cygnet-page .stat { background: white; border-radius: 10px; padding: 20px 14px; text-align: center; border: 1px solid #e8e4df; position: relative; overflow: hidden; }
        .cygnet-page .stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .cygnet-page .stat.teal::before { background: #2E8B8B; }
        .cygnet-page .stat.gold::before { background: #E8A838; }
        .cygnet-page .stat.navy::before { background: #1B3A5C; }
        .cygnet-page .stat .num { font-family: 'DM Serif Display', serif !important; font-size: 36px; line-height: 1.1; margin-bottom: 4px; }
        .cygnet-page .num-teal { color: #2E8B8B; } .cygnet-page .num-gold { color: #D4922A; } .cygnet-page .num-navy { color: #1B3A5C; }
        .cygnet-page .stat .label { font-size: 14px; color: #888; font-weight: 500; }

        .cygnet-page .process { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0 28px; }
        @media (max-width: 600px) { .cygnet-page .process { grid-template-columns: 1fr 1fr; } }
        .cygnet-page .step { background: #1B3A5C; border-radius: 10px; padding: 20px 14px; text-align: center; position: relative; }
        .cygnet-page .step .step-num { display: inline-block; width: 34px; height: 34px; border-radius: 50%; background: #2E8B8B; color: white; font-weight: 700; font-size: 16px; line-height: 34px; margin-bottom: 10px; }
        .cygnet-page .step h4 { font-size: 16px; font-weight: 700; color: #E8A838; margin-bottom: 6px; }
        .cygnet-page .step p { font-size: 14px; color: #b8cfe0; line-height: 1.5; }

        .cygnet-page .accred { background: linear-gradient(135deg, #1B3A5C, #244b6e); border-radius: 12px; padding: 28px; margin-top: 18px; position: relative; overflow: hidden; }
        .cygnet-page .accred::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #E8A838, #2E8B8B); }
        .cygnet-page .accred h3 { font-family: 'DM Serif Display', serif !important; font-size: 24px; color: #E8A838; margin-bottom: 12px; font-weight: 400; }
        .cygnet-page .accred p { font-size: 17px; color: #b8cfe0; }
        .cygnet-page .accred p + p { margin-top: 10px; }
        .cygnet-page .accred strong { color: #fff; }

        .cygnet-page .footer-bar { background: #1B3A5C; padding: 24px 28px; text-align: center; }
        .cygnet-page .footer-bar p { font-size: 15px; color: #7fa8c4; }
        .cygnet-page .footer-bar a { color: #3AAFAF; text-decoration: none; }
      `}</style>

      <div className="cygnet-page">
        <div className="hero">
          <h1>Cygnet Institute of Personal Financial Literacy</h1>
          <p>Fiduciary 501(c)(3) nonprofit financial educator — teaching adults financial skills since 1989</p>
          <div className="tags">
            <span className="tag">Fiduciary Standard</span>
            <span className="tag">NCCA-Accredited CRC&reg;</span>
            <span className="tag">No Hidden Agenda</span>
            <span className="tag">Since 1989</span>
          </div>
        </div>

        <div className="wrap">

          {/* CORE PILLARS */}
          <div className="section-label">What Makes Cygnet Different <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <div className="icon">🛡️</div>
              <h4>No Hidden Agenda</h4>
              <p>Charter prohibits soliciting participants as clients for any purpose. Not a marketing front for product sales.</p>
            </div>
            <div className="pillar">
              <div className="icon">💰</div>
              <h4>Fee, Not Commission</h4>
              <p>Consultants earn fees for advice — no product sales, no conflicts of interest.</p>
            </div>
            <div className="pillar">
              <div className="icon">⚖️</div>
              <h4>Fiduciary Standard</h4>
              <p>Strict adherence to fiduciary responsibility throughout the entire process. Confidentiality guaranteed.</p>
            </div>
            <div className="pillar">
              <div className="icon">🎓</div>
              <h4>Experiential Learning</h4>
              <p>Participants build their own financial plan in class using the copyrighted Financial Lifestyle Analysis℠.</p>
            </div>
          </div>

          {/* LEADERSHIP */}
          <div className="card">
            <h3>Leadership</h3>
            <p><strong>Ted Lakkides, CFP®, CRC®</strong> — President. Certified Financial Planner™ and Certified Retirement Counselor®. Has led Cygnet Institute since its founding, pioneering the Financial Lifestyle Analysis℠ process and building partnerships with UAW locals, Rochester Christian University, and financial institutions across Southeast Michigan.</p>
          </div>

          {/* THE FLA PROCESS */}
          <div className="section-label">The Financial Lifestyle Analysis℠ (FLA℠) <span className="line"></span></div>

          <div className="card">
            <p>The Financial Lifestyle Analysis℠ is a <strong>copyrighted, year-by-year projection tool</strong> pioneered by Cygnet that lets individuals see the future impact of their financial decisions today — like a video of their financial life on fast-forward. It connects all aspects of a person's financial picture: wages, Social Security, pensions, 401(k) savings, spending patterns, and long-term goals. It answers the questions people worry about most: Am I saving enough? When can I retire? Will my money last?</p>
            <p>The FLA℠ is the foundation of every Cygnet workshop. It is <strong>cash-flow-based, goal-oriented, transparent, and focused on lifestyle quality</strong> — not on selling financial products.</p>
          </div>

          {/* 4-STEP PROCESS */}
          <div className="section-label">The Cygnet 4-Step Process <span className="line"></span></div>

          <div className="process">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Explain &amp; Collect</h4>
              <p>Explain process, collect financial info, begin Spending Diary</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Review &amp; Project</h4>
              <p>Review spending, project future needs, review retirement revenue</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Refine &amp; Protect</h4>
              <p>Refine cash flow plan, review survivor's plan, insurance, estate</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Finalize &amp; Invest</h4>
              <p>Final plan review, investment analysis, portfolio decisions</p>
            </div>
          </div>

          {/* WORKSHOP PROGRAMS */}
          <div className="section-label">Workshop Programs <span className="line"></span></div>

          <div className="card">
            <div className="meta">SEM 100 / SEM 101 — Financial Plan Checkup℠</div>
            <h3>4-Session Building-Block Workshop</h3>
            <p>Covers personal finance fundamentals, spending analysis, net worth, Social Security, pension review, career projections, retirement cash flow planning, and investment overview. Participants build their complete Financial Lifestyle Analysis℠ across all four sessions.</p>
            <p><strong>SEM 100</strong> — In-person classroom delivery at employer/union facilities.<br />
            <strong>SEM 101</strong> — Asynchronous online delivery via Rochester Christian University's Canvas LMS, with voice-over lectures, quizzes, and assignments.</p>
            <p><strong>$532 per participant</strong> · Maximum 15 per workshop · Instructor: Certified CRC® professional</p>
          </div>

          <div className="card">
            <div className="meta">SEM 103 — Retirement Cash Flow Planning</div>
            <h3>3-Session Focused Workshop</h3>
            <p>Concentrated retirement readiness program. January 2026 results at UAW 653 PPO Facility: <strong>4.91/5.0 overall rating</strong>, 82% motivated to act "Right Away," 100% reported attitude change, +4.1 point CFPB Financial Well-Being improvement.</p>
          </div>

          {/* LATEST RESULTS */}
          <div className="section-label">January 2026 Workshop Results <span className="line"></span></div>

          <div className="stats">
            <div className="stat teal"><div className="num num-teal">4.91</div><div className="label">Overall Rating<br />(out of 5.0)</div></div>
            <div className="stat navy"><div className="num num-navy">91%</div><div className="label">Perfect 5/5<br />Score</div></div>
            <div className="stat gold"><div className="num num-gold">82%</div><div className="label">Motivated to<br />Act "Right Away"</div></div>
            <div className="stat teal"><div className="num num-teal">+4.1</div><div className="label">CFPB Score<br />Improvement</div></div>
          </div>

          {/* CERTIFICATION PIPELINE */}
          <div className="section-label">Certification Program — LQFM/LQFA <span className="line"></span></div>

          <div className="card">
            <h3>Training Veterans and Others to Become Fee-Based Financial Wellness Educators</h3>
            <p>The 24-month LQFM (Licensed Qualified Financial Manager) / LQFA (Licensed Qualified Financial Advisor) program trains individuals — with a focus on veterans — to deliver Cygnet's workshops as certified, fee-based financial consultants.</p>
            <p><strong>$23,000 tuition</strong> · 24 months · Leads to CRC® designation eligibility</p>
            <p>CRC® requirements: comprehensive exam, minimum 2 years professional experience (bachelor's) or 5 years (high school diploma), Code of Ethics adherence, 15 hours continuing education annually.</p>
          </div>

          {/* CRC ACCREDITATION */}
          <div className="accred">
            <h3>CRC® — Certified Retirement Counselor®</h3>
            <p>The CRC® is issued by the <strong>International Foundation for Retirement Education (InFRE)</strong>, a 501(c)(3) nonprofit. Academic partner: <strong>Texas Tech University</strong> Center for Financial Responsibility.</p>
            <p>The CRC® is <strong>NCCA-accredited through 7/31/2029</strong> — one of only six NCCA-accredited financial certifications in the United States (alongside the CFP®, AFC, CVA, MAFF, and CSA).</p>
            <p>Created in 1998, the CRC® is now used by <strong>60+ public sector retirement systems</strong> nationally, including CalPERS, the Federal Retirement Thrift Investment Board, Ohio STRS, South Dakota Retirement System, Texas County &amp; District Retirement System, and dozens of state, county, and local entities.</p>
            <p>Endorsed by the <strong>National Association of Government Defined Contribution Administrators (NAGDCA)</strong> and the <strong>National Pension Education Association (NPEA)</strong>.</p>
          </div>

          {/* INSTITUTIONAL PARTNERSHIP */}
          <div className="section-label">Institutional Partnership <span className="line"></span></div>

          <div className="card">
            <h3>Rochester Christian University (2023)</h3>
            <p>Cygnet Institute and Rochester Christian University in Rochester Hills, Michigan formalized a partnership to broaden financial literacy delivery across Oakland County and Southeast Michigan. Joint initiatives include:</p>
            <p>• Employer-sponsored 401(k) workshops (in-person and online via Canvas LMS)<br />
            • Workforce development program to train fee-based Certified Retirement Counselors®<br />
            • Financial Wellness Center at the university<br />
            • Outreach program for Fiduciary Finance Clubs in Michigan high schools</p>
            <p><em>"This partnership represents a significant milestone for both institutions. By combining our pioneering work in financial wellness education with RCU's deep community roots and commitment to fostering innovation, we aim to create transformative opportunities for individuals to take control of their finances."</em> — Ted Lakkides, President</p>
          </div>

          {/* DELIVERY MODELS */}
          <div className="section-label">Delivery Models <span className="line"></span></div>

          <div className="card">
            <p><strong>Employer-sponsored workplace seminars</strong> — Delivered at UAW locations and employer facilities. Structured as standalone employee benefit or 401(k) plan education requirement.</p>
            <p><strong>Online asynchronous</strong> — Via Rochester Christian University's Canvas LMS with voice-over lectures, quizzes, and weekly assignments. Instructor support from certified CRC® professionals.</p>
            <p><strong>Financial wellness kiosks</strong> — On-site access points at employer and community locations.</p>
            <p><strong>Community programs</strong> — Library-based, LMI community, and senior center delivery, aligned with FDIC MoneySmart materials and CRA bank partnership requirements.</p>
          </div>

          {/* THREE AUDIENCES */}
          <div className="section-label">Three Audiences, One Mission <span className="line"></span></div>

          <div className="pillars">
            <div className="pillar">
              <h4>Working Families</h4>
              <p>401(k) workshops, retirement readiness, budgeting, and debt management education. Appeals to both employees and management.</p>
            </div>
            <div className="pillar">
              <h4>Veterans</h4>
              <p>Recruitment pipeline for the LQFM/LQFA certification program. A meaningful second career path leveraging discipline, leadership, and service.</p>
            </div>
          </div>
          <div className="card" style={{ textAlign: "center" }}>
            <h3>LMI Communities</h3>
            <p>Low-to-moderate income populations — unlocking CRA bank partnerships, FDIC MoneySmart alignment, and government grant opportunities for financial education in underserved areas.</p>
          </div>

        </div>

        <div className="footer-bar">
          <p><strong>Cygnet Institute of Personal Financial Literacy</strong><br />
          6515 Highland Rd, Ste #240, Waterford, MI 48327 · (248) 800-2525 · <a href="https://cygnetinstitute.org">cygnetinstitute.org</a></p>
        </div>
      </div>
    </div>
  );
}
