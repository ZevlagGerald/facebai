const nav = ["Tambayan", "Mga Bai", "Isturya", "Marketplace", "Events"];
const groups = ["Cebu Food Trip Bai", "Laagan Ta Bai", "Bisaya Creators", "Plantita ug Plantito Bai"];
const trends = ["#LaaganTaBai", "#CebuFoodTrip", "#BisayaProud", "#GoodBaiOnly", "#SupportLocalBai"];

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="FaceBai home">
          <span>FaceBai</span>
          <small>facebai.party</small>
        </a>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input aria-label="Search FaceBai" placeholder="Search mga bai, posts, lugar, o bisan unsa..." />
        </label>
        <nav className="topnav" aria-label="Primary navigation">
          {nav.map((item, index) => <a className={index === 0 ? "active" : ""} href="#" key={item}>{item}</a>)}
        </nav>
        <button className="profile-button">Zev ▾</button>
      </header>

      <div className="leaf leaf-a" aria-hidden="true" />
      <div className="leaf leaf-b" aria-hidden="true" />

      <div className="dashboard">
        <aside className="left-column panel">
          <section className="profile-summary">
            <div className="avatar avatar-main">Z</div>
            <div><strong>Zev</strong><span>Tan-aw sa imong profile</span></div>
          </section>
          <div className="side-nav">
            {nav.map((item, index) => <a className={index === 0 ? "selected" : ""} href="#" key={item}>{item}</a>)}
            <a href="#">Saved</a><a href="#">Memories</a><a href="#">Settings</a>
          </div>
          <section className="group-list">
            <div className="section-heading"><h2>Akong Groups</h2><a href="#">Tan-aw tanan</a></div>
            {groups.map((group, index) => (
              <a className="group-row" href="#" key={group}>
                <span className={`group-thumb group-${index + 1}`} />
                <span><strong>{group}</strong><small>{[124, 98, 76, 52][index]}K members</small></span>
              </a>
            ))}
            <button className="soft-button">＋ Gumawa og Group</button>
          </section>
          <p className="motto">Mas Lami ang Kinabuhi Together.</p>
        </aside>

        <section className="feed-column">
          <section className="panel stories">
            <div className="section-heading"><h1>Isturya sa Mga Bai</h1><a href="#">Tan-aw tanan →</a></div>
            <div className="story-grid">
              {["＋ Your Isturya", "Marco", "Alyssa", "Cebu Trips", "Foodie Bai", "Doggo Bai"].map((story, i) => (
                <article className={`story-card story-${i}`} key={story}><span>{story}</span></article>
              ))}
            </div>
          </section>

          <section className="panel composer">
            <div className="composer-row"><div className="avatar">Z</div><button>Unsa man, Zev? Naay bago sa imong kinabuhi?</button></div>
            <div className="composer-actions"><button>▣ Litrato/Vidyo</button><button>☺ Feeling / Activity</button><button>⌖ Tag Lugar</button><button>•••</button></div>
          </section>

          <article className="panel post-card">
            <header className="post-header"><div className="avatar">JB</div><div><strong>Jr Cabatingan</strong><small>2h · Cebu City · ●</small></div><button>•••</button></header>
            <p>Laag ta sa Kawasan Falls! 🌿<br/>Bisaya jud, laagan jud! Mas lami ang kinabuhi kung kuyog ang mga bai.</p>
            <div className="post-photo" role="img" aria-label="Tropical waterfall photo placeholder"><span>Kawasan Falls · Cebu</span></div>
            <div className="post-meta"><span>👍 ❤️ 😄 3.4K</span><span>320 comments · 112 shares</span></div>
            <footer className="post-actions"><button>♡ Lami!</button><button>◯ Comment</button><button>↗ Share</button><button>▢ Save</button></footer>
          </article>
        </section>

        <aside className="right-column">
          <section className="hero panel"><div><strong>FaceBai</strong><small>facebai.party</small></div><p>Same People.<br/>Mas Lami nga Connections.</p></section>
          <section className="panel trends">
            <div className="section-heading"><h2>Trending sa Tambayan</h2><a href="#">Tan-aw tanan</a></div>
            {trends.map((trend, i) => <a href="#" className="trend" key={trend}><b>{i + 1}</b><span><strong>{trend}</strong><small>{[12.4,8.1,6.7,5.9,4.3][i]}K posts</small></span><i>•••</i></a>)}
          </section>
          <section className="panel suggestions">
            <div className="section-heading"><h2>Mga Bai nga Basin Kaila Nimo</h2></div>
            {["Mika Dela Cruz", "Paulo Maningo", "Angela Tan"].map((name, i) => <div className="suggestion" key={name}><div className="avatar">{name[0]}</div><span><strong>{name}</strong><small>{i + 2} mutual friends</small></span><button>Add Bai</button></div>)}
          </section>
        </aside>
      </div>
    </main>
  );
}
