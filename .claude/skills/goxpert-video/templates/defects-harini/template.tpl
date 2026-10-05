<!doctype html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Defects Apa Harini EP __EP__</title>
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

      #cam, #marks { position: absolute; inset: 0; transform-origin: 50% 50%; }
      #marks { pointer-events: none; }
      .footage { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .ico { display: block; width: 1em; height: 1em; flex: none; }
      .mask { display: block; overflow: hidden; }

      #progress { position: absolute; left: 0; top: 0; width: 100%; height: 12px; }
      #progress-fill { display: block; width: 100%; height: 100%; background: var(--accent); transform-origin: 0 50%; }

      .chip {
        display: flex; align-items: center; gap: 14px; padding: 14px 24px 12px;
        font-family: var(--mono); font-weight: 700; font-size: 38px; letter-spacing: 0.03em; white-space: nowrap;
        background: var(--ink); color: var(--paper); border: 4px solid var(--accent);
      }
      .chip.solid { background: var(--accent); color: var(--ink); border-color: var(--accent); }
      .chip .ico { font-size: 40px; }

      .cap { position: absolute; left: 60px; right: 60px; bottom: 440px; display: flex; justify-content: center; }
      .cap-in {
        display: block; max-width: 960px; padding: 14px 30px 6px;
        background: rgba(29, 26, 51, 0.92); color: var(--paper);
        font-family: var(--display); font-size: 96px; line-height: 1; text-transform: uppercase;
        text-align: center; letter-spacing: 0.01em;
      }
      .cap-in b { font-weight: 400; color: var(--accent); }

      /* ---- Series ident: "DEFECTS APA HARINI?" ---- */
      #intro { position: absolute; inset: 0; overflow: hidden; }
      #intro-shade { position: absolute; inset: 0; background: rgba(29, 26, 51, 0.78); }
      #intro-ring { position: absolute; left: 700px; top: 470px; width: 300px; height: 300px; border-radius: 50%; border: 10px dashed var(--accent); }
      #intro-box { position: absolute; left: 70px; right: 60px; top: 680px; display: flex; flex-direction: column; align-items: flex-start; }
      #intro-ep { margin-bottom: 30px; }
      .id-line { display: block; font-family: var(--display); font-size: 250px; line-height: 0.86; color: var(--paper); text-transform: uppercase; }
      #id-3 { display: flex; align-items: flex-end; margin-top: 18px; padding: 16px 30px 0; background: var(--accent); color: var(--ink); }
      #id-q { display: inline-block; transform-origin: 50% 85%; }
      #intro-sub { margin-top: 36px; display: block; font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.14em; color: var(--accent); }

      /* ---- Series badge (stays on after the ident) ---- */
      #badge { position: absolute; left: 60px; top: 150px; display: flex; align-items: stretch; }
      #badge-q { display: flex; align-items: center; justify-content: center; width: 64px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 62px; line-height: 1; padding-top: 6px; }
      #badge-t { display: flex; align-items: center; padding: 10px 20px 8px; background: rgba(29, 26, 51, 0.92); color: var(--paper); font-family: var(--mono); font-weight: 700; font-size: 30px; letter-spacing: 0.06em; white-space: nowrap; }
      #badge-t b { color: var(--accent); margin-left: 14px; }

      /* ---- Defect title ---- */
      #g-defect { position: absolute; left: 60px; right: 60px; top: 250px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
      #defect-title { display: block; padding: 12px 28px 2px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 180px; line-height: 0.95; text-transform: uppercase; }

      /* ---- Location marks (ride the same zoom as the footage) ---- */
      .mark { position: absolute; left: 0; top: 0; width: 0; height: 0; }
      .ring { position: absolute; left: -110px; top: -110px; width: 220px; height: 220px; border-radius: 50%; border: 8px dashed var(--accent); box-shadow: 0 0 0 4px rgba(29, 26, 51, 0.35); }
      .mark-tag { position: absolute; }
      .mark.right .mark-tag { left: 135px; top: -36px; }
      .mark.left .mark-tag { right: 135px; top: -36px; }
      .mark.above .mark-tag { left: 50%; bottom: 135px; transform: translateX(-50%); }
      .mark.below .mark-tag { left: 50%; top: 135px; transform: translateX(-50%); }

      /* ---- Risks + level meter ---- */
      #g-risk { position: absolute; inset: 0; }
      #level { position: absolute; left: 60px; top: 250px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 22px 30px 20px; background: rgba(29, 26, 51, 0.92); border-top: 10px solid var(--accent); }
      #level-k { display: block; font-family: var(--mono); font-weight: 700; font-size: 32px; letter-spacing: 0.14em; color: var(--accent); }
      #level-row { display: flex; align-items: flex-end; gap: 14px; }
      .lv { display: block; width: 64px; border: 5px solid var(--paper); background: transparent; }
      .lv.on { background: var(--accent); border-color: var(--accent); }
      #level-v { display: block; margin-left: 18px; font-family: var(--display); font-size: 150px; line-height: 0.8; color: var(--paper); text-transform: uppercase; }
      #risk-list { position: absolute; left: 60px; right: 60px; bottom: 590px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
      .step { display: flex; align-items: center; gap: 18px; padding: 10px 22px 8px 10px; background: rgba(29, 26, 51, 0.92); color: var(--paper); font-family: var(--mono); font-weight: 700; font-size: 38px; white-space: nowrap; }
      .step .num { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 58px; padding-top: 6px; }

      /* ---- Verdict stamp ---- */
      #g-stamp { position: absolute; inset: 0; }
      #stamp { position: absolute; left: 60px; top: 330px; display: block; padding: 18px 34px 6px; border: 12px solid var(--accent); color: var(--accent); background: rgba(29, 26, 51, 0.6); font-family: var(--display); font-size: 150px; line-height: 1; text-transform: uppercase; }
      #tip { position: absolute; left: 60px; bottom: 590px; }

      #flash-host { position: absolute; inset: 0; pointer-events: none; }
      #flash { position: absolute; inset: 0; background: var(--paper); opacity: 0; }

      /* ---- End card ---- */
      #endcard { position: absolute; inset: 0; overflow: hidden; }
      #end-bg { position: absolute; inset: -40px; width: calc(100% + 80px); height: calc(100% + 80px); object-fit: cover; }
      #end-shade { position: absolute; inset: 0; background: rgba(29, 26, 51, 0.82); }
      #stripe { position: absolute; left: 56px; top: 470px; width: 10px; height: 1080px; background: var(--accent); transform-origin: 50% 0%; }
      #end-content { position: absolute; left: 100px; right: 60px; top: 470px; display: flex; flex-direction: column; align-items: flex-start; }
      #end-kicker { display: block; font-family: var(--mono); font-weight: 700; font-size: 34px; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 26px; }
      .end-line { display: block; font-family: var(--display); font-size: 200px; line-height: 0.9; color: var(--paper); text-transform: uppercase; }
      .end-line.hl { color: var(--accent); }
      #brand { margin-top: 56px; }
      #brand-card { display: flex; align-items: center; padding: 24px 38px; background: #ffffff; border-radius: 22px; transform-origin: 0% 50%; }
      #brand-logo { display: block; width: 540px; height: 187px; }
      #cta { display: flex; align-items: center; gap: 20px; margin-top: 50px; padding: 24px 34px 20px; background: var(--accent); color: var(--ink); font-family: var(--mono); font-weight: 700; font-size: 64px; }
      #cta-label { display: block; font-size: 32px; letter-spacing: 0.12em; }
      #next { margin-top: 30px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="__TOTAL__">
      <div id="cam">
__VIDEOS__
      </div>

      <div id="marks">
__MARKS__
      </div>

      <div id="g-defect" class="clip" data-start="__D_AT__" data-duration="__D_DUR__" data-track-index="2">
        <div id="defect-kick" class="chip solid">__WARN__ DEFECT HARINI</div>
        <span class="mask"><span id="defect-title">__D_TITLE__</span></span>
        <div id="defect-place" class="chip">__PIN__ __D_PLACE__</div>
      </div>

      <div id="g-risk" class="clip" data-start="__R_AT__" data-duration="__R_DUR__" data-track-index="2">
        <div id="level">
          <span id="level-k">TAHAP RISIKO</span>
          <div id="level-row">
__LEVELBARS__
            <span id="level-v">__L_LABEL__</span>
          </div>
        </div>
        <div id="risk-list">
          <div id="risk-head" class="chip solid">__WARN__ __R_HEAD__</div>
__RISKS__
        </div>
      </div>

      <div id="g-stamp" class="clip" data-start="__S_AT__" data-duration="__S_DUR__" data-track-index="2">
        <span id="stamp">__S_TEXT__</span>
        <div id="tip" class="chip solid">__S_TIP__</div>
      </div>

      <div id="badge" class="clip" data-start="__INTRO__" data-duration="__BADGEDUR__" data-track-index="3">
        <span id="badge-q">?</span><span id="badge-t">DEFECTS APA HARINI<b>EP __EP__</b></span>
      </div>

      <div id="progress" class="clip" data-start="0" data-duration="__END__" data-track-index="3">
        <span id="progress-fill"></span>
      </div>

__CAPS__

      <div id="intro" class="clip" data-start="0" data-duration="__INTRO__" data-track-index="4">
        <div id="intro-shade"></div>
        <span id="intro-ring"></span>
        <div id="intro-box">
          <div id="intro-ep" class="chip">EP __EP__ · __DATE__</div>
          <span class="mask"><span id="id-1" class="id-line">Defects</span></span>
          <span class="mask"><span id="id-2" class="id-line">Apa</span></span>
          <span id="id-3" class="id-line">Harini<span id="id-q">?</span></span>
          <span id="intro-sub">__KICKER__</span>
        </div>
      </div>

      <div id="endcard" class="clip" data-start="__END__" data-duration="__ENDDUR__" data-track-index="4">
        <img id="end-bg" data-layout-allow-overflow src="assets/last.jpg" alt="" />
        <div id="end-shade"></div>
        <div id="stripe"></div>
        <div id="end-content">
          <span id="end-kicker">DEFECTS APA HARINI? · EP __EP__</span>
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
          <div id="next" class="chip">__NEXT__ __ARROW__</div>
        </div>
      </div>

      <div id="flash-host" class="clip" data-start="0" data-duration="__TOTAL__" data-track-index="5">
        <div id="flash"></div>
      </div>

__SFX__
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      const I = __INTRO__, E = __END__;

      // ---- Series ident
      tl.fromTo("#cam", { scale: 1.12 }, { scale: 1, duration: I + 0.4, ease: "power2.out" }, 0);
      tl.fromTo("#intro-ring", { scale: 0.3, opacity: 0, rotation: -90 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)" }, 0.05);
      tl.fromTo("#intro-ring", { x: 0, y: 0 }, { x: -60, y: 40, duration: I - 0.5, ease: "sine.inOut", immediateRender: false }, 0.5);
      tl.fromTo("#intro-ep", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, 0.08);
      tl.fromTo(["#id-1", "#id-2"], { yPercent: 105 }, { yPercent: 0, duration: 0.32, ease: "power4.out", stagger: 0.1 }, 0.18);
      tl.fromTo("#id-3", { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "expo.out", transformOrigin: "0% 50%" }, 0.42);
      tl.fromTo("#id-q", { rotation: 0, scale: 1 }, { rotation: 14, scale: 1.25, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 3, immediateRender: false }, 0.8);
      tl.fromTo("#intro-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.9);
      tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.9, duration: 0.06, ease: "none" }, I - 0.06);
      tl.to("#flash", { opacity: 0, duration: 0.3, ease: "power2.out" }, I);

      // ---- Badge + progress
      tl.fromTo("#badge", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }, I + 0.05);
      tl.fromTo("#progress-fill", { scaleX: 0 }, { scaleX: 1, duration: E, ease: "none" }, 0);

      // ---- Defect title
      tl.fromTo("#defect-kick", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }, __D_AT__);
      tl.fromTo("#defect-title", { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power4.out" }, __D_AT__ + 0.12);
      tl.fromTo("#defect-place", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.24, ease: "back.out(2)" }, __D_AT__ + 0.5);

      // ---- Zooms (footage and marks move together)
__ZOOMJS__

      // ---- Marks
__MARKJS__

      // ---- Risks + level
      tl.fromTo("#level", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, __R_AT__);
      tl.fromTo(".lv", { scaleY: 0 }, { scaleY: 1, duration: 0.2, ease: "back.out(2)", transformOrigin: "50% 100%", stagger: 0.14 }, __R_AT__ + 0.2);
      tl.fromTo("#level-v", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power4.out", transformOrigin: "0% 50%" }, __R_AT__ + 0.7);
      tl.fromTo("#risk-head", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.25, ease: "power4.out", transformOrigin: "0% 50%" }, __R_AT__ + 0.1);
__RISKJS__

      // ---- Verdict stamp
      tl.fromTo("#stamp", { opacity: 0, scale: 2.4, rotation: -2 }, { opacity: 1, scale: 1, rotation: -7, duration: 0.18, ease: "power4.in" }, __S_AT__ + 0.05);
      tl.fromTo("#tip", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.28, ease: "back.out(2)" }, __S_AT__ + 0.6);

      // ---- Captions
__CAPJS__

      // ---- End card
      tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.9, duration: 0.05, ease: "none", immediateRender: false }, E - 0.05);
      tl.to("#flash", { opacity: 0, duration: 0.3, ease: "power2.out" }, E);
      tl.fromTo("#end-bg", { filter: "blur(0px)", scale: 1.1 }, { filter: "blur(18px)", scale: 1, duration: 0.8, ease: "power2.out" }, E);
      tl.fromTo("#end-shade", { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }, E);
      tl.fromTo("#stripe", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out" }, E + 0.1);
      tl.fromTo("#end-kicker", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, E + 0.15);
      tl.fromTo(["#end-1", "#end-2", "#end-3"], { yPercent: 105 }, { yPercent: 0, duration: 0.5, ease: "power4.out", stagger: 0.1 }, E + 0.3);
      tl.fromTo("#brand-card", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, E + 1.3);
      tl.fromTo("#cta", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)" }, E + 1.9);
      tl.fromTo("#next", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }, E + 2.4);

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
