<!doctype html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>GoXpert Inspection 3</title>
    <script src="vendor/gsap.min.js"></script>
    <style>
      :root {
        --ink: #1d1a33;
        --paper: #f6f2e7;
        --accent: #f6c33b;
        --display: "League Gothic", "Oswald", sans-serif;
        --mono: "JetBrains Mono", monospace;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--ink); }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--ink); }

      #cam, #cam-fg { position: absolute; inset: 0; transform-origin: 50% 30%; }
      #cam-fg { pointer-events: none; }
      .footage { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

      .ico { display: block; width: 1em; height: 1em; flex: none; }

      /* progress bar */
      #progress { position: absolute; left: 0; top: 0; width: 100%; height: 12px; }
      #progress-fill { display: block; width: 100%; height: 100%; background: var(--accent); transform-origin: 0 50%; }

      /* captions */
      .cap { position: absolute; left: 60px; right: 60px; bottom: 440px; display: flex; justify-content: center; }
      .cap-in {
        display: block; max-width: 960px; padding: 14px 30px 6px;
        background: rgba(29, 26, 51, 0.92); color: var(--paper);
        font-family: var(--display); font-size: 96px; line-height: 1; text-transform: uppercase;
        text-align: center; letter-spacing: 0.01em;
      }
      .cap-in b { font-weight: 400; color: var(--accent); }

      /* shared chip */
      .chip {
        display: flex; align-items: center; gap: 14px; padding: 14px 24px 12px;
        font-family: var(--mono); font-weight: 700; font-size: 38px; letter-spacing: 0.03em; white-space: nowrap;
        background: var(--ink); color: var(--paper); border: 4px solid var(--accent);
      }
      .chip.solid { background: var(--accent); color: var(--ink); border-color: var(--accent); }
      .chip .ico { font-size: 40px; }

      /* G1 inspection counter */
      #g-count { position: absolute; left: 60px; top: 150px; display: flex; flex-direction: column; gap: 16px; }
      #count-label { display: block; font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.14em; color: var(--ink); background: var(--paper); padding: 8px 16px 6px; align-self: flex-start; }
      #count-row { display: flex; gap: 16px; }
      .cbox {
        display: flex; align-items: center; justify-content: center; width: 120px; height: 120px;
        border: 6px solid var(--paper); background: rgba(29, 26, 51, 0.85); color: var(--paper);
        font-family: var(--display); font-size: 92px; line-height: 1; padding-top: 8px; position: relative;
      }
      .cbox .tick { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: var(--paper); color: var(--ink); font-size: 84px; padding-top: 0; }
      #cbox3 { background: var(--accent); border-color: var(--accent); color: var(--ink); }
      #count-tags { display: flex; gap: 14px; }

      /* G2 final stage + flow */
      #g-final { position: absolute; left: 60px; right: 60px; top: 150px; display: flex; flex-direction: column; align-items: flex-start; gap: 26px; }
      #final-bar { display: block; padding: 12px 28px 2px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 170px; line-height: 0.95; text-transform: uppercase; }
      #flow { display: flex; align-items: center; gap: 14px; }
      .flow-arrow { display: block; color: var(--paper); font-size: 46px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5)); }

      /* G3 previous reports */
      #g-before { position: absolute; left: 60px; top: 170px; }

      /* G4/G5 defect + good/bad */
      #g-defect { position: absolute; left: 60px; top: 150px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
      #defect-tag { font-size: 46px; }
      #split { display: flex; gap: 16px; }

      /* G6 jom tengok */
      #g-jom { position: absolute; right: 60px; top: 190px; }
      #jom { font-size: 52px; }

      /* G7 first inspection + stamp */
      #g-first { position: absolute; left: 60px; right: 60px; top: 150px; height: 520px; }
      #first-tag { position: absolute; left: 0; top: 0; }
      #stamp {
        position: absolute; right: 20px; top: 150px; display: block; padding: 18px 34px 6px;
        border: 10px solid var(--accent); color: var(--accent); background: rgba(29, 26, 51, 0.55);
        font-family: var(--display); font-size: 150px; line-height: 1; text-transform: uppercase;
      }

      /* G8/G9 hole callouts */
      .g-hole { position: absolute; left: 60px; top: 960px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
      .hole-title { display: block; padding: 10px 24px 2px; background: var(--ink); color: var(--paper); font-family: var(--display); font-size: 110px; line-height: 1; text-transform: uppercase; border-left: 12px solid var(--accent); }
      .hole-status { font-size: 44px; }

      /* G10 all fixed */
      #g-ok { position: absolute; left: 60px; right: 60px; top: 560px; display: flex; flex-direction: column; align-items: center; gap: 22px; }
      #ok-badge { display: flex; align-items: center; justify-content: center; width: 220px; height: 220px; border-radius: 50%; background: var(--accent); color: var(--ink); font-size: 150px; }
      #ok-card { display: flex; flex-direction: column; align-items: center; padding: 22px 40px 14px; background: var(--ink); border: 6px solid var(--accent); }
      #ok-kicker { display: block; font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.16em; color: var(--accent); }
      #ok-line { display: block; font-family: var(--display); font-size: 140px; line-height: 1; color: var(--paper); text-transform: uppercase; }

      /* part 2 shared */
      .p2 { position: absolute; left: 60px; right: 60px; top: 150px; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
      .big-title { display: block; padding: 10px 26px 2px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 150px; line-height: 0.95; text-transform: uppercase; }
      .big-title.dark { background: var(--ink); color: var(--paper); border-left: 14px solid var(--accent); }
      #nor-stamp { position: absolute; left: 60px; top: 700px; display: flex; align-items: center; gap: 18px; padding: 16px 30px 6px; border: 10px solid var(--paper); color: var(--paper); background: rgba(29, 26, 51, 0.6); font-family: var(--display); font-size: 140px; line-height: 1; text-transform: uppercase; }
      #nor-stamp .ico { font-size: 110px; margin-top: -10px; }
      #g-quote { position: absolute; left: 60px; right: 60px; top: 150px; }
      #quote-card { display: flex; flex-direction: column; gap: 8px; padding: 26px 34px 20px; background: rgba(29, 26, 51, 0.92); border-top: 10px solid var(--accent); }
      #quote-mark { display: block; font-family: var(--display); font-size: 140px; line-height: 0.6; color: var(--accent); height: 60px; }
      .quote-line { display: block; font-family: var(--display); font-size: 104px; line-height: 1; color: var(--paper); text-transform: uppercase; }
      .quote-line.hl { color: var(--accent); }
      #g-steps { position: absolute; inset: 0; }
      #steps-head { position: absolute; left: 60px; top: 150px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
      #steps-list { position: absolute; left: 60px; right: 60px; bottom: 590px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
      #solution { display: block; padding: 8px 22px 0; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 120px; line-height: 1; text-transform: uppercase; }
      .step { display: flex; align-items: center; gap: 18px; padding: 10px 22px 8px 10px; background: rgba(29, 26, 51, 0.92); color: var(--paper); font-family: var(--mono); font-weight: 700; font-size: 38px; white-space: nowrap; }
      .step .num { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 58px; padding-top: 6px; }
      #step3 { font-size: 58px; border: 5px solid var(--accent); }
      #step3 .num { width: 84px; height: 84px; font-size: 76px; }
      #last-resort { margin-left: 104px; }
      #hak { position: absolute; left: 0; right: 0; top: 170px; display: flex; justify-content: center; }
      #hak-in { display: block; padding: 14px 40px 4px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 170px; line-height: 1; text-transform: uppercase; }

      /* before photos */
      .photo-card { position: absolute; padding: 18px 18px 22px; background: #ffffff; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45); }
      .photo-card img { display: block; object-fit: cover; }
      .photo-label { position: absolute; left: -14px; top: -34px; display: flex; align-items: center; gap: 12px; padding: 10px 20px 8px; background: var(--accent); color: var(--ink); font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.06em; white-space: nowrap; }
      #pc1 { left: 560px; top: 850px; }
      #pc1 img { width: 430px; height: 430px; }
      #loc { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; pointer-events: none; }
      #loc-ring { position: absolute; left: -110px; top: -110px; width: 220px; height: 220px; border-radius: 50%; border: 8px dashed var(--accent); box-shadow: 0 0 0 4px rgba(29, 26, 51, 0.35); }
      #loc-tag { position: absolute; left: -160px; top: -200px; }
      #pc2 { left: 260px; top: 790px; }
      #pc2 img { width: 520px; height: 520px; }
      #g-proof { position: absolute; inset: 0; }
      #proof-head { position: absolute; left: 60px; top: 150px; }
      #pc3a { left: 70px; top: 260px; }
      #pc3b { left: 560px; top: 300px; }
      #pc3a img, #pc3b img { width: 420px; height: 420px; }
      #pc3a { top: 280px; }
      #pc3b { top: 330px; }

      /* flash */
      #flash-host { position: absolute; inset: 0; pointer-events: none; }
      #flash { position: absolute; inset: 0; background: var(--paper); opacity: 0; }

      /* end card */
      #endcard { position: absolute; inset: 0; overflow: hidden; }
      #end-bg { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; }
      #end-shade { position: absolute; inset: 0; background: rgba(29, 26, 51, 0.82); }
      #stripe { position: absolute; left: 56px; top: 520px; width: 10px; height: 1080px; background: var(--accent); transform-origin: 50% 0%; }
      #end-content { position: absolute; left: 100px; right: 60px; top: 520px; display: flex; flex-direction: column; align-items: flex-start; }
      #end-kicker { display: block; font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 26px; }
      .mask { display: block; overflow: hidden; }
      .end-line { display: block; font-family: var(--display); font-size: 200px; line-height: 0.9; color: var(--paper); text-transform: uppercase; }
      .end-line.hl { color: var(--accent); }
      #brand { margin-top: 56px; }
      #brand-card { display: flex; align-items: center; padding: 24px 38px; background: #ffffff; border-radius: 22px; transform-origin: 0% 50%; }
      #brand-logo { display: block; width: 540px; height: 187px; }
      #cta { display: flex; align-items: center; gap: 20px; margin-top: 50px; padding: 24px 34px 20px; background: var(--accent); color: var(--ink); font-family: var(--mono); font-weight: 700; font-size: 64px; }
      #cta-label { display: block; font-size: 32px; letter-spacing: 0.12em; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="__TOTAL__">
      <div id="cam">
__VIDEOS__
      </div>

      <!-- Graphics -->
      <div id="g-count" class="clip" data-start="0" data-duration="2.97" data-track-index="2">
        <span id="count-label">INSPECTION</span>
        <div id="count-row">
          <div id="cbox1" class="cbox">1<span class="tick">__CHECK__</span></div>
          <div id="cbox2" class="cbox">2<span class="tick">__CHECK__</span></div>
          <div id="cbox3" class="cbox">3</div>
        </div>
        <div id="count-tags">
          <div id="count-tag" class="chip solid">KALI KE-3</div>
          <div id="tribunal-hook" class="chip">SEBELUM KE TRIBUNAL</div>
        </div>
      </div>

      <div id="g-final" class="clip" data-start="3.5" data-duration="6.19" data-track-index="2">
        <span class="mask"><span id="final-bar">Final Stage</span></span>
        <div id="flow">
          <div id="flow1" class="chip">LAPORAN</div>
          <span id="fa1" class="flow-arrow">__ARROW__</span>
          <div id="flow2" class="chip">DEVELOPER</div>
          <span id="fa2" class="flow-arrow">__ARROW__</span>
          <div id="flow3" class="chip solid">BAIKI</div>
        </div>
      </div>

      <div id="g-before" class="clip" data-start="10.55" data-duration="1.64" data-track-index="2">
        <div id="before-chip" class="chip">LAPORAN INSPECTION #1 &amp; #2</div>
      </div>

      <div id="g-defect" class="clip" data-start="12.19" data-duration="3.88" data-track-index="2">
        <div id="defect-tag" class="chip solid">__WARN__ MASIH ADA DEFECT</div>
        <div id="split">
          <div id="good" class="chip">__CHECK__ BAIK</div>
          <div id="bad" class="chip">__CROSS__ TAK BAIK</div>
        </div>
      </div>

      <div id="g-jom" class="clip" data-start="16.9" data-duration="1.75" data-track-index="2">
        <div id="jom" class="chip solid">JOM TENGOK __ARROW__</div>
      </div>

      <div id="g-first" class="clip" data-start="19.42" data-duration="4.78" data-track-index="2">
        <div id="first-tag" class="chip">INSPECTION #1</div>
        <span id="stamp">Dilaporkan</span>
      </div>

      <div id="g-hole1" class="g-hole clip" data-start="24.2" data-duration="2.24" data-track-index="2">
        <span id="h1-title" class="hole-title">Lubang #1</span>
        <div id="h1-status" class="chip solid hole-status">__CHECK__ DAH TAMPAL</div>
      </div>

      <div id="g-hole2" class="g-hole clip" data-start="26.44" data-duration="1.7" data-track-index="2">
        <span id="h2-title" class="hole-title">Lubang #2</span>
        <div id="h2-status" class="chip solid hole-status">__CHECK__ DAH TAMPAL</div>
      </div>

      <div id="g-ok" class="clip" data-start="29.3" data-duration="2.2" data-track-index="2">
        <div id="ok-badge">__CHECK__</div>
        <div id="ok-card">
          <span id="ok-kicker">STATUS DEFECT</span>
          <span id="ok-line">Semua Dah Tampal</span>
        </div>
      </div>

      <!-- Part 2 -->
      <div id="g-pond" class="p2 clip" data-start="__T_PONDS__" data-duration="__T_PONDD__" data-track-index="2">
        <div id="pond-tag" class="chip solid">__WARN__ AIR BERTAKUNG</div>
        <div id="pond-wp" class="chip">__CHECK__ WATERPROOF DISAPU SEMULA</div>
        <div id="pond-prep" class="chip">__CROSS__ TIADA SURFACE PREPARATION</div>
      </div>

      <div id="g-still" class="p2 clip" data-start="__T_STILLS__" data-duration="__T_STILLD__" data-track-index="2">
        <span class="mask"><span id="still-title" class="big-title">Masih Bertakung</span></span>
        <div id="still-chip" class="chip">REPORT KALI KE-3</div>
      </div>

      <div id="g-tile" class="p2 clip" data-start="__T_TILES__" data-duration="__T_TILED__" data-track-index="2">
        <span class="mask"><span id="tile-title" class="big-title">Genting Pecah</span></span>
        <div id="tile-chip" class="chip">REPORT KALI KE-3</div>
      </div>

      <div id="g-nor" class="clip" data-start="__T_NORS__" data-duration="__T_NORD__" data-track-index="2" style="position:absolute;inset:0">
        <span id="nor-stamp">__CROSS__ Tak Dibaiki</span>
      </div>

      <div id="g-quote" class="clip" data-start="__T_QS__" data-duration="__T_QD__" data-track-index="2">
        <div id="quote-card">
          <span id="quote-mark">&ldquo;</span>
          <span id="q1" class="quote-line">Kita nak <span class="hl">kepastian</span></span>
          <span id="q2" class="quote-line">&amp; <span class="hl">jaminan</span></span>
          <span id="q3" class="quote-line">defect dibaiki</span>
        </div>
      </div>

      <div id="g-steps" class="clip" data-start="__T_STS__" data-duration="__T_STD__" data-track-index="2">
        <div id="steps-head">
          <div id="k3-chip" class="chip">KALI KE-3 · MASIH ADA DEFECT</div>
          <span class="mask"><span id="solution">Solution?</span></span>
        </div>
        <div id="steps-list">
          <div id="step1" class="step"><span class="num">1</span>SURAT &amp; NOTIS</div>
          <div id="step2" class="step"><span class="num">2</span>SEBUT HARGA KONTRAKTOR BERDAFTAR</div>
          <div id="step3" class="step"><span class="num">3</span>BAWA KE TRIBUNAL</div>
          <div id="last-resort" class="chip solid">JALAN PENYELESAIAN TERAKHIR</div>
        </div>
        <div id="hak"><span id="hak-in">Ini Hak Anda</span></div>
      </div>

      <!-- Before photos -->
      <div id="g-loc" class="clip" data-start="24.2" data-duration="2.2" data-track-index="6" style="position:absolute;inset:0">
        <div id="loc"><span id="loc-ring"></span><div id="loc-tag" class="chip solid">LOKASI DIBAIKI</div></div>
      </div>
      <div id="g-before1" class="clip" data-start="25.0" data-duration="1.44" data-track-index="6" style="position:absolute;inset:0">
        <div id="pc1" class="photo-card"><img src="assets/before-hole.jpg" alt="" /><span class="photo-label">BEFORE</span></div>
      </div>
      <div id="g-before2" class="clip" data-start="__T_PB2S__" data-duration="__T_PB2D__" data-track-index="6" style="position:absolute;inset:0">
        <div id="pc2" class="photo-card"><img src="assets/before-ponding.jpg" alt="" /><span class="photo-label">BEFORE · AIR BERTAKUNG</span></div>
      </div>
      <div id="g-proof" class="clip" data-start="__T_PB3S__" data-duration="__T_PB3D__" data-track-index="6">
        <div id="proof-head" class="chip solid">BEFORE · GENTING PECAH</div>
        <div id="pc3a" class="photo-card"><img src="assets/before-tiles.jpg" alt="" /></div>
        <div id="pc3b" class="photo-card"><img src="assets/before-tile-crack.jpg" alt="" /></div>
      </div>

      <!-- Subject cut-out (muted, background removed) in front of big graphics -->
      <div id="cam-fg">
__FGVIDEOS__
      </div>

      <div id="progress" class="clip" data-start="0" data-duration="__END__" data-track-index="3">
        <span id="progress-fill"></span>
      </div>

      <!-- Captions -->
__CAPS__

      <!-- End card -->
      <div id="endcard" class="clip" data-start="__END__" data-duration="__ENDDUR__" data-track-index="4">
        <img id="end-bg" data-layout-allow-overflow src="assets/last-frame2.jpg" alt="" />
        <div id="end-shade"></div>
        <div id="stripe"></div>
        <div id="end-content">
          <span id="end-kicker">INSPECTION KE-3 · SEBELUM KE TRIBUNAL</span>
          <span class="mask"><span id="end-1" class="end-line">Pemeriksaan</span></span>
          <span class="mask"><span id="end-2" class="end-line">Rumah</span></span>
          <span class="mask"><span id="end-3" class="end-line hl">Profesional</span></span>
          <div id="brand">
            <div id="brand-card"><img id="brand-logo" src="assets/logo.png" alt="GoXpert Solutions" /></div>
          </div>
          <div id="cta">
            <span id="cta-label">WHATSAPP</span>
            <span id="cta-num">011-3144 6591</span>
          </div>
        </div>
      </div>

      <div id="flash-host" class="clip" data-start="0" data-duration="__TOTAL__" data-track-index="5">
        <div id="flash"></div>
      </div>

      <!-- Sound design (speech stays on the video clips) -->
__SFX__
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });

      // ---- Jump-cut framing: alternate punch per cut so cuts read as intentional
__ZOOM__
      tl.fromTo("#cam, #cam-fg", { scale: 1 }, { scale: 1.08, duration: 0.14, ease: "power3.out", immediateRender: false }, 0.85);
      tl.fromTo("#cam, #cam-fg", { scale: 1 }, { scale: 1.14, duration: 0.14, ease: "power3.out", immediateRender: false }, 3.59);
      tl.set("#cam, #cam-fg", { scale: 1 }, 16.07);
      tl.fromTo("#cam, #cam-fg", { scale: 1 }, { scale: 1.08, duration: 0.14, ease: "power3.out", immediateRender: false }, 29.35);

      // ---- Progress bar
      tl.fromTo("#progress-fill", { scaleX: 0 }, { scaleX: 1, duration: __END__, ease: "none" }, 0);

      // ---- G1 counter
      tl.fromTo("#count-label", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 0.05);
      tl.fromTo(".cbox", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)", stagger: 0.06 }, 0.1);
      tl.fromTo("#cbox1 .tick", { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.3);
      tl.fromTo("#cbox2 .tick", { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.55);
      tl.fromTo("#cbox3", { scale: 1 }, { scale: 1.3, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, 0.88);
      tl.fromTo("#count-tag", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "expo.out" }, 0.9);

      // ---- G2 final stage + flow
      tl.fromTo("#final-bar", { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power4.out" }, 3.59);
      [["#flow1", 4.5], ["#fa1", 5.9], ["#flow2", 6.0], ["#fa2", 8.6], ["#flow3", 8.7]].forEach(([sel, t]) => {
        tl.fromTo(sel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.24, ease: "back.out(2)" }, t);
      });

      // ---- G3 previous reports
      tl.fromTo("#before-chip", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 10.6);

      // ---- G4/G5 defect + good/bad
      tl.fromTo("#defect-tag", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power4.out", transformOrigin: "0% 50%" }, 12.22);
      tl.fromTo("#defect-tag", { x: 0 }, { x: 8, duration: 0.05, ease: "none", yoyo: true, repeat: 5, immediateRender: false }, 12.47);
      tl.fromTo("#good", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.22, ease: "back.out(2)" }, 14.42);
      tl.fromTo("#bad", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.22, ease: "back.out(2)" }, 15.27);

      // ---- G6 jom tengok
      tl.fromTo("#jom", { xPercent: 130 }, { xPercent: 0, duration: 0.35, ease: "expo.out" }, 16.95);

      // ---- G7 first inspection + rubber stamp
      tl.fromTo("#first-tag", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 19.45);
      tl.fromTo("#stamp", { opacity: 0, scale: 2.4, rotation: -2 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.18, ease: "power4.in" }, 22.38);

      // ---- G8/G9 hole callouts
      tl.fromTo("#h1-title", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 24.3);
      tl.fromTo("#h1-status", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", transformOrigin: "0% 50%" }, 25.35);
      tl.fromTo("#h2-title", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 26.5);
      tl.fromTo("#h2-status", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.4)", transformOrigin: "0% 50%" }, 27.25);

      // ---- G10 all fixed
      tl.fromTo("#ok-badge", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)" }, 29.35);
      tl.fromTo("#ok-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 29.5);

      // ---- Hook: before tribunal
      tl.fromTo("#tribunal-hook", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "expo.out" }, 1.62);
      tl.fromTo("#tribunal-hook", { scale: 1 }, { scale: 1.12, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false, transformOrigin: "0% 50%" }, 1.62);

      // ---- Part 2: ponding
      tl.fromTo("#pond-tag", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power4.out", transformOrigin: "0% 50%" }, __T_POND1__);
      tl.fromTo("#pond-wp", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.24, ease: "back.out(2)" }, __T_POND2__);
      tl.fromTo("#pond-prep", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.24, ease: "back.out(2)" }, __T_POND3__);
      tl.fromTo("#pond-prep", { x: 0 }, { x: 8, duration: 0.05, ease: "none", yoyo: true, repeat: 5, immediateRender: false }, __T_POND3__ + 0.25);
      tl.fromTo("#still-title", { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power4.out" }, __T_STILL1__);
      tl.fromTo("#still-chip", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_STILL2__);
      tl.fromTo("#tile-title", { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power4.out" }, __T_TILE1__);
      tl.fromTo("#tile-chip", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_TILE2__);
      tl.fromTo("#nor-stamp", { opacity: 0, scale: 2.4, rotation: 2 }, { opacity: 1, scale: 1, rotation: -7, duration: 0.18, ease: "power4.in" }, __T_NOR1__);

      // ---- Part 2: quote
      tl.fromTo("#quote-card", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, __T_Q1__ - 0.05);
      tl.fromTo("#q1", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_Q1__);
      tl.fromTo("#q2", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_Q2__);
      tl.fromTo("#q3", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_Q3__);

      // ---- Part 2: solution steps -> tribunal
      tl.fromTo("#k3-chip", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_ST0__);
      tl.fromTo("#solution", { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power4.out" }, __T_ST1__);
      tl.fromTo("#step1", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.28, ease: "back.out(1.8)" }, __T_ST2__);
      tl.fromTo("#step2", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.28, ease: "back.out(1.8)" }, __T_ST3__);
      tl.to(["#step1", "#step2"], { opacity: 0.75, duration: 0.25 }, __T_ST4__ - 0.05);
      tl.to("#steps-head", { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" }, __T_ST4__ - 0.05);
      tl.fromTo("#step3", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.out", transformOrigin: "0% 50%" }, __T_ST4__);
      tl.fromTo("#last-resort", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)" }, __T_ST5__);
      tl.fromTo("#hak-in", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.out" }, __T_ST6__);

      // ---- Before photos
      // location first: ring tracks his fingertip along the patched joint (measured from footage)
      tl.fromTo("#loc", { x: 320, y: 400 }, { x: 440, y: 580, duration: 0.4, ease: "none" }, 24.24);
      tl.to("#loc", { x: 560, y: 640, duration: 0.4, ease: "none" }, 24.64);
      tl.to("#loc", { x: 560, y: 740, duration: 0.4, ease: "none" }, 25.04);
      tl.to("#loc", { x: 640, y: 760, duration: 0.4, ease: "none" }, 25.44);
      tl.fromTo("#loc-ring", { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }, 24.24);
      tl.fromTo("#loc-ring", { rotation: 0 }, { rotation: 120, duration: 2.1, ease: "none", immediateRender: false }, 24.24);
      tl.fromTo("#loc-tag", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 24.35);
      tl.to("#loc", { opacity: 0, duration: 0.2 }, 26.15);
      // then the before photo
      tl.fromTo("#pc1", { opacity: 0, y: 120, rotation: 8, scale: 0.85 }, { opacity: 1, y: 0, rotation: -3, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 25.02);
      tl.fromTo("#pc1 img", { scale: 1 }, { scale: 1.08, duration: 1.4, ease: "none" }, 25.02);
      tl.to("#pc1", { opacity: 0, y: 40, duration: 0.2, ease: "power2.in" }, 26.22);
      tl.fromTo("#pc2", { opacity: 0, y: 120, rotation: -8, scale: 0.85 }, { opacity: 1, y: 0, rotation: 3, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, __T_PB2S__ + 0.02);
      tl.fromTo("#pc2 img", { scale: 1 }, { scale: 1.08, duration: __T_PB2D__, ease: "none" }, __T_PB2S__ + 0.02);
      tl.to("#pc2", { opacity: 0, y: -60, duration: 0.25, ease: "power2.in" }, __T_PB2S__ + __T_PB2D__ - 0.3);
      tl.fromTo("#proof-head", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __T_PB3S__ + 0.02);
      tl.fromTo("#pc3a", { opacity: 0, x: -200, rotation: -12 }, { opacity: 1, x: 0, rotation: -4, duration: 0.4, ease: "back.out(1.6)" }, __T_PB3S__ + 0.08);
      tl.fromTo("#pc3b", { opacity: 0, x: 200, rotation: 12 }, { opacity: 1, x: 0, rotation: 4, duration: 0.4, ease: "back.out(1.6)" }, __T_PB3S__ + 0.2);
      tl.to(["#proof-head", "#pc3a", "#pc3b"], { opacity: 0, duration: 0.25, ease: "power2.in" }, __T_PB3S__ + __T_PB3D__ - 0.3);

      // ---- Captions
__CAPJS__

      // ---- Transition to end card
      tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.9, duration: 0.05, ease: "none" }, __T_FLASH1__);
      tl.to("#flash", { opacity: 0, duration: 0.3, ease: "power2.out" }, __END__);
      tl.fromTo("#end-bg", { filter: "blur(0px)", scale: 1.1 }, { filter: "blur(18px)", scale: 1, duration: 0.8, ease: "power2.out" }, __END__);
      tl.fromTo("#end-shade", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, __END__);
      tl.fromTo("#stripe", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out" }, __T_ENDP1__);
      tl.fromTo("#end-kicker", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, __T_ENDP2__);
      tl.fromTo(["#end-1", "#end-2", "#end-3"], { yPercent: 105 }, { yPercent: 0, duration: 0.5, ease: "power4.out", stagger: 0.1 }, __T_ENDP3__);
      tl.fromTo("#brand-card", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, __T_ENDP4__);
      tl.fromTo("#cta", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)" }, __T_ENDP5__);
      tl.fromTo("#cta", { scale: 1 }, { scale: 1.04, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, __T_ENDP6__);

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
