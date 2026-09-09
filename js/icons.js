/* ==========================================================================
   icons.js — every drawn mark on the page.
   Stage thumbnails, NDT method diagrams, project visuals, flow builders.
   No emoji, no icon font: inline SVG so everything scales and recolours.
   ========================================================================== */
(function (w) {
  "use strict";

  /* ---------- stage thumbnails (career rail) ---------- */
  var STAGE = {
    hardware:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<g stroke="#4FB3B8" stroke-width="1" opacity=".5" fill="none"><path d="M18 26H62v22h46"/><path d="M18 70h32V54"/><path d="M136 20v24h26"/></g>' +
      '<rect x="68" y="38" width="38" height="26" fill="#16202A" stroke="#5E7285"/>' +
      '<g stroke="#5E7285" stroke-width="1"><path d="M68 45h-7M68 52h-7M68 59h-7M106 45h7M106 52h7M106 59h7"/></g>' +
      '<circle cx="74" cy="44" r="2" fill="#F0A63C"/>' +
      '<g fill="#4FB3B8" opacity=".8"><circle cx="62" cy="26" r="2"/><circle cx="136" cy="44" r="2"/><circle cx="50" cy="70" r="2"/></g></svg>',

    code:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<rect x="24" y="18" width="132" height="60" fill="#101822" stroke="#2A3846"/>' +
      '<rect x="24" y="18" width="132" height="10" fill="#16202A"/>' +
      '<g fill="#4FB3B8" opacity=".85"><circle cx="32" cy="23" r="1.8"/><circle cx="39" cy="23" r="1.8"/><circle cx="46" cy="23" r="1.8"/></g>' +
      '<g stroke="#4FB3B8" stroke-width="2" opacity=".5"><path d="M34 40h38M42 50h54M42 60h38"/></g>' +
      '<path d="M108 40 98 50l10 10M128 40l10 10-10 10" stroke="#F0A63C" stroke-width="2" fill="none"/></svg>',

    ar3d:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<rect x="52" y="12" width="76" height="72" rx="5" fill="#101822" stroke="#5E7285"/>' +
      '<rect x="58" y="20" width="64" height="56" fill="#0A1219"/>' +
      '<g stroke="#F0A63C" stroke-width="1.2" fill="none"><path d="M90 32l18 10v16l-18 10-18-10V42z"/><path d="M72 42l18 10 18-10M90 52v16"/></g>' +
      '<g fill="#4FB3B8"><circle cx="72" cy="42" r="2.6"/><circle cx="108" cy="58" r="2.6"/></g>' +
      '<g stroke="#4FB3B8" stroke-width="1" opacity=".45"><path d="M58 20h8M58 20v8M122 76h-8M122 76v-8"/></g></svg>',

    quality:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<rect x="26" y="54" width="128" height="14" fill="#1B2531" stroke="#5E7285"/>' +
      '<rect x="50" y="40" width="24" height="14" fill="#24313F" stroke="#5E7285"/>' +
      '<rect x="106" y="40" width="24" height="14" fill="#24313F" stroke="#5E7285"/>' +
      '<g stroke="#8494A5" stroke-width="1"><path d="M26 54V34M154 54V34"/></g>' +
      '<path d="M74 47h32" stroke="#F0A63C" stroke-width="1.4"/>' +
      '<g stroke="#F0A63C" stroke-width="1"><path d="M74 41v12M106 41v12"/></g>' +
      '<circle cx="90" cy="22" r="11" fill="none" stroke="#4FB3B8" stroke-width="1.4"/>' +
      '<path d="M90 22v-8" stroke="#F0A63C" stroke-width="1.6"/></svg>',

    ndt:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0E0C09"/>' +
      '<path d="M26 30l128 10v18L26 68z" fill="#3B4A5B"/><path d="M26 30l128 10v18L26 68z" fill="#F0A63C" opacity=".1"/>' +
      '<ellipse cx="26" cy="49" rx="10" ry="19" fill="#141C25" stroke="#5E7285"/>' +
      '<ellipse cx="86" cy="45" rx="9" ry="21" fill="none" stroke="#F0A63C" stroke-width="2"/>' +
      '<ellipse cx="86" cy="45" rx="14" ry="29" fill="none" stroke="#F0A63C" stroke-width=".8" opacity=".35"/>' +
      '<g stroke="#F0A63C" stroke-width=".8" opacity=".5"><path d="M86 16V8M86 74v8"/></g></svg>',

    oilgas:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<g stroke="#5E7285" stroke-width="5" fill="none" opacity=".9"><path d="M12 68h46V34h50"/><path d="M108 34V20"/><path d="M82 68h86"/></g>' +
      '<g stroke="#8FA6BD" stroke-width="1" fill="none" opacity=".5"><path d="M12 68h46V34h50"/><path d="M82 68h86"/></g>' +
      '<rect x="53" y="28" width="10" height="10" fill="#24313F" stroke="#8FA6BD"/>' +
      '<rect x="103" y="15" width="10" height="10" fill="#24313F" stroke="#8FA6BD"/>' +
      '<circle cx="132" cy="68" r="7" fill="#141C25" stroke="#F0A63C" stroke-width="1.4"/>' +
      '<path d="M132 61v14M125 68h14" stroke="#F0A63C" stroke-width="1.1"/></svg>',

    documentation:
      '<svg viewBox="0 0 180 96" aria-hidden="true"><rect width="180" height="96" fill="#0B1116"/>' +
      '<rect x="34" y="12" width="62" height="74" fill="#101822" stroke="#2A3846"/>' +
      '<rect x="44" y="19" width="62" height="74" fill="#131C26" stroke="#3A4A5B"/>' +
      '<rect x="54" y="26" width="62" height="74" fill="#16202A" stroke="#5E7285"/>' +
      '<g stroke="#4FB3B8" stroke-width="1.5" opacity=".6"><path d="M63 38h43M63 47h36M63 56h45M63 65h29"/></g>' +
      '<path d="M63 76h37" stroke="#F0A63C" stroke-width="1.6"/>' +
      '<g fill="#4FB3B8"><circle cx="130" cy="34" r="2.6"/><circle cx="142" cy="50" r="2.6" opacity=".6"/><circle cx="130" cy="64" r="2.6" opacity=".35"/></g>' +
      '<g stroke="#4FB3B8" stroke-width=".8" opacity=".5"><path d="M118 40l10-6M118 54l22-4M118 62l10 2"/></g></svg>'
  };

  /* ---------- NDT method diagrams ---------- */
  var F = '<rect width="220" height="112" fill="#0B1116"/>';
  var NDT = {
    vt: F + '<rect x="24" y="72" width="172" height="22" fill="#2C3947"/><path d="M108 72l4 22" stroke="#0A0E12" stroke-width="3"/>' +
        '<ellipse cx="110" cy="36" rx="30" ry="17" fill="none" stroke="#F0A63C" stroke-width="1.6"/>' +
        '<circle cx="110" cy="36" r="8" fill="none" stroke="#F0A63C" stroke-width="1.6"/><circle cx="110" cy="36" r="3" fill="#F0A63C"/>' +
        '<g stroke="#F0A63C" stroke-width="1" opacity=".5"><path d="M110 53v17M100 53l4 17M120 53l-4 17"/></g>',

    pt: F + '<rect x="24" y="60" width="172" height="34" fill="#2C3947"/><path d="M104 60l4 28 4-28z" fill="#0A0E12"/>' +
        '<path d="M104 60l4 24 4-24z" fill="#E4443C" opacity=".85"/><ellipse cx="108" cy="60" rx="26" ry="9" fill="#E4443C" opacity=".3"/>' +
        '<g fill="#E4443C"><circle cx="72" cy="34" r="4"/><path d="M72 22q6 8 0 12-6-4 0-12z"/></g>' +
        '<g fill="#E4443C" opacity=".55"><circle cx="146" cy="30" r="3"/><circle cx="120" cy="20" r="2.5"/></g>' +
        '<text x="150" y="86" fill="#5F7183" font-family="monospace" font-size="9">BLEED-OUT</text>',

    mt: F + '<rect x="24" y="66" width="172" height="28" fill="#2C3947"/><path d="M108 66l2 20" stroke="#0A0E12" stroke-width="3"/>' +
        '<g stroke="#4FB3B8" stroke-width="1.2" fill="none" opacity=".75"><path d="M62 66q47-40 94 0"/><path d="M62 66q47-26 94 0"/><path d="M62 66q47-14 94 0"/></g>' +
        '<rect x="48" y="60" width="20" height="14" fill="#B3402F"/><text x="58" y="71" text-anchor="middle" fill="#fff" font-family="monospace" font-size="9">N</text>' +
        '<rect x="150" y="60" width="20" height="14" fill="#2C5C8A"/><text x="160" y="71" text-anchor="middle" fill="#fff" font-family="monospace" font-size="9">S</text>' +
        '<g fill="#F0A63C"><circle cx="105" cy="62" r="2"/><circle cx="111" cy="60" r="2"/><circle cx="108" cy="56" r="2"/><circle cx="114" cy="63" r="1.6"/><circle cx="102" cy="57" r="1.6"/></g>',

    ut: F + '<rect x="24" y="46" width="172" height="48" fill="#2C3947"/><rect x="86" y="24" width="44" height="20" fill="#16202A" stroke="#8FA6BD"/>' +
        '<path d="M96 24v-6M108 24v-10M120 24v-6" stroke="#8FA6BD" stroke-width="1.4"/>' +
        '<g stroke="#F0A63C" stroke-width="1.4" fill="none" opacity=".9"><path d="M96 48q12 10 24 0"/><path d="M92 54q16 14 32 0"/><path d="M88 60q20 18 40 0"/></g>' +
        '<ellipse cx="108" cy="76" rx="16" ry="4" fill="#0A0E12"/><path d="M24 94h172" stroke="#8FA6BD" stroke-width="1" opacity=".4"/>' +
        '<text x="150" y="40" fill="#5F7183" font-family="monospace" font-size="9">4.0 MHz</text>',

    rt: F + '<circle cx="108" cy="20" r="8" fill="none" stroke="#F0A63C" stroke-width="1.6"/>' +
        '<path d="M108 14v12M102.8 17l10.4 6M102.8 23l10.4-6" stroke="#F0A63C" stroke-width="1.2"/>' +
        '<path d="M108 28 58 66h100z" fill="#F0A63C" opacity=".1"/>' +
        '<g stroke="#F0A63C" stroke-width=".8" opacity=".4"><path d="M108 28 70 66M108 28 88 66M108 28v38M108 28l20 38M108 28l38 38"/></g>' +
        '<rect x="58" y="66" width="100" height="16" fill="#3B4A5B"/><ellipse cx="112" cy="74" rx="9" ry="3" fill="#0A0E12"/>' +
        '<rect x="46" y="90" width="124" height="12" fill="#14202B" stroke="#4FB3B8"/><ellipse cx="112" cy="96" rx="9" ry="3.5" fill="#4FB3B8" opacity=".75"/>' +
        '<text x="176" y="100" fill="#5F7183" font-family="monospace" font-size="9">FILM</text>',

    paut: F + '<rect x="24" y="46" width="172" height="48" fill="#2C3947"/>' +
        '<g fill="#16202A" stroke="#8FA6BD" stroke-width=".8"><rect x="72" y="30" width="8" height="16"/><rect x="82" y="30" width="8" height="16"/><rect x="92" y="30" width="8" height="16"/><rect x="102" y="30" width="8" height="16"/><rect x="112" y="30" width="8" height="16"/><rect x="122" y="30" width="8" height="16"/></g>' +
        '<g stroke="#F0A63C" stroke-width="1.2" fill="none" opacity=".85"><path d="M101 46 64 88M101 46 82 90M101 46v44M101 46l21 44M101 46l41 42"/></g>' +
        '<path d="M101 46 64 88h78z" fill="#F0A63C" opacity=".07"/><path d="M136 60l6 10" stroke="#0A0E12" stroke-width="3"/>' +
        '<text x="150" y="42" fill="#5F7183" font-family="monospace" font-size="9">SECTOR</text>',

    pwht: F + '<rect x="24" y="52" width="172" height="34" rx="17" fill="#2C3947"/>' +
        '<g stroke="#E07B32" stroke-width="3" fill="none" opacity=".9"><path d="M78 52q6 17 0 34"/><path d="M92 52q6 17 0 34"/><path d="M106 52q6 17 0 34"/><path d="M120 52q6 17 0 34"/><path d="M134 52q6 17 0 34"/></g>' +
        '<rect x="70" y="48" width="76" height="42" fill="#E07B32" opacity=".14"/>' +
        '<path d="M28 34q42 0 68-16t92 4" stroke="#F0A63C" stroke-width="1.6" fill="none"/>' +
        '<g fill="#5F7183" font-family="monospace" font-size="8"><text x="28" y="46">SOAK</text><text x="164" y="42">COOL</text></g>',

    ht: F + '<rect x="24" y="64" width="172" height="30" fill="#2C3947"/>' +
        '<path d="M96 20h24v24l-12 20z" fill="#16202A" stroke="#8FA6BD" stroke-width="1.2"/>' +
        '<path d="M100 64l8 12 8-12" fill="#0A0E12" stroke="#F0A63C" stroke-width="1.4"/>' +
        '<g stroke="#F0A63C" stroke-width="1" opacity=".6"><path d="M108 8v10M96 12l4 8M120 12l-4 8"/></g>' +
        '<g stroke="#4FB3B8" stroke-width="1" opacity=".55"><path d="M140 64v30M148 64v30M136 64h16M136 94h16"/></g>' +
        '<text x="158" y="82" fill="#5F7183" font-family="monospace" font-size="9">HV</text>',

    pmi: F + '<rect x="24" y="76" width="172" height="18" fill="#2C3947"/>' +
        '<path d="M70 26h54v24h-20l-6 12H86l-6-12H70z" fill="#16202A" stroke="#8FA6BD" stroke-width="1.2"/>' +
        '<path d="M86 62l4 14M98 62l-4 14" stroke="#F0A63C" stroke-width="1.2" opacity=".8"/><path d="M92 62v14" stroke="#F0A63C" stroke-width="1.6"/>' +
        '<g fill="#4FB3B8"><rect x="140" y="60" width="5" height="16"/><rect x="149" y="46" width="5" height="30"/><rect x="158" y="66" width="5" height="10"/><rect x="167" y="38" width="5" height="38"/><rect x="176" y="56" width="5" height="20"/></g>' +
        '<path d="M136 76h52" stroke="#2A3846" stroke-width="1"/><text x="136" y="34" fill="#5F7183" font-family="monospace" font-size="9">ALLOY %</text>',

    ft: F + '<rect x="24" y="62" width="172" height="32" fill="#2C3947"/>' +
        '<path d="M88 62q20-16 40 0v32H88z" fill="#3B4A5B"/>' +
        '<g stroke="#22303D" stroke-width="1"><path d="M94 62q14-10 28 0"/><path d="M99 62q9-6 18 0"/></g>' +
        '<rect x="96" y="24" width="24" height="24" fill="#16202A" stroke="#8FA6BD" stroke-width="1.2"/><path d="M108 48v10" stroke="#8FA6BD" stroke-width="2"/>' +
        '<path d="M154 78a26 26 0 0 1 40 0" fill="none" stroke="#2A3846" stroke-width="4"/>' +
        '<path d="M154 78a26 26 0 0 1 12-21" fill="none" stroke="#F0A63C" stroke-width="4"/>' +
        '<circle cx="174" cy="78" r="2.5" fill="#F0A63C"/><text x="174" y="94" text-anchor="middle" fill="#5F7183" font-family="monospace" font-size="9">FN</text>'
  };
  Object.keys(NDT).forEach(function (k) {
    NDT[k] = '<svg viewBox="0 0 220 112" aria-hidden="true">' + NDT[k] + '</svg>';
  });

  /* ---------- small line icons ---------- */
  function ic(d, stroke, size) {
    return '<svg width="' + (size || 26) + '" height="' + (size || 26) + '" viewBox="0 0 24 24" fill="none" stroke="' +
      (stroke || '#4FB3B8') + '" stroke-width="1.4" aria-hidden="true">' + d + '</svg>';
  }
  var ICON = {
    chip:   ic('<rect x="2.5" y="4" width="19" height="13" rx="1.5"/><path d="M8 20.5h8M12 17v3.5M6.5 8.5 9 11l-2.5 2.5M11.5 13.5H16"/>'),
    shield: ic('<path d="M12 2.5 20.5 6v6.2c0 4.6-3.4 8-8.5 9.3-5.1-1.3-8.5-4.7-8.5-9.3V6Z"/><path d="m8.4 12.2 2.6 2.6 4.8-5.1"/>'),
    wave:   ic('<path d="M2.5 12h3l2-5.5 3.2 12L14 6.5l2 5.5h5.5"/>', '#F0A63C'),
    doc:    ic('<path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5Z"/><path d="M14 2.5V7.5H19M8.5 12h7M8.5 16h4.5"/>'),
    people: ic('<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>', '#4FB3B8', 17),
    box:    ic('<path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5Z"/><path d="M3 8.5 12 13l9-4.5M12 13v7"/>', '#4FB3B8', 17),
    case:   ic('<rect x="3" y="6.5" width="18" height="14" rx="1.5"/><path d="M8.5 6.5V4.5h7v2M3 12h18"/>', '#4FB3B8', 17),
    docS:   ic('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8Z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h4"/>', '#F0A63C', 17),
    lock:   ic('<rect x="4" y="10" width="16" height="10.5" rx="1.5"/><path d="M8 10V6.8a4 4 0 0 1 8 0V10"/>', '#4FB3B8', 17),
    plant:  ic('<path d="M3 19h18M5 19V9l7-5 7 5v10M10 19v-5h4v5"/>', '#4FB3B8', 22),
    bars:   ic('<path d="M3 15h18M5 15V8M12 15V5M19 15v-4M4 20h16"/>', '#4FB3B8', 22),
    flow:   ic('<path d="M3 7h9v10h9M12 7V4M21 17v3"/><circle cx="12" cy="12" r="1.6"/>', '#4FB3B8', 22),
    valve:  ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>', '#4FB3B8', 22),
    mail:   ic('<rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="m3 6.5 9 6.5 9-6.5"/>', '#F0A63C', 19),
    linked: ic('<rect x="2.5" y="2.5" width="19" height="19" rx="2"/><path d="M7 10.5V17M7 7.2v.1M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17"/>', '#F0A63C', 19),
    github: ic('<path d="M9 19c-4.5 1.4-4.5-2.3-6.4-2.8M15.5 21.5v-3.6a3.1 3.1 0 0 0-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 0 0-1.4-3.4 4.6 4.6 0 0 0-.1-3.4s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6.5 1.9 5.4 2.2 5.4 2.2A4.6 4.6 0 0 0 5.3 5.6 5 5 0 0 0 4 9.1c0 4.9 3 6 5.9 6.4a3.1 3.1 0 0 0-.9 2.3v3.7"/>', '#F0A63C', 19),
    whats:  ic('<path d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.2A9 9 0 0 0 12 21Z"/><path d="M8.6 9.2c.4 2.4 3.8 5.8 6.2 6.2l1.2-1.6 1.6.9v1.4c-3.6.9-8.6-4.1-9.5-7.7h1.4z"/>', '#F0A63C', 19),
    arrow:  ic('<path d="M5 12h14M13 6l6 6-6 6"/>', 'currentColor', 15),
    down:   ic('<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/>', 'currentColor', 15),
    eye:    ic('<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>', 'currentColor', 15)
  };

  /* ---------- project visuals ---------- */
  var PROJ = {
    film:
      '<svg viewBox="0 0 300 150" aria-hidden="true"><rect width="300" height="150" fill="#0B1116"/>' +
      '<rect x="34" y="24" width="94" height="112" fill="#12202B" stroke="#2C5C6A"/>' +
      '<ellipse cx="81" cy="66" rx="20" ry="8" fill="#4FB3B8" opacity=".45"/><ellipse cx="81" cy="96" rx="14" ry="6" fill="#4FB3B8" opacity=".3"/>' +
      '<g stroke="#2C5C6A" stroke-width="1"><path d="M34 44h94M34 116h94"/></g>' +
      '<path d="M146 80h40" stroke="#F0A63C" stroke-width="1.4"/><path d="M178 74l8 6-8 6" stroke="#F0A63C" stroke-width="1.4" fill="none"/>' +
      '<rect x="200" y="24" width="66" height="112" fill="#101822" stroke="#5E7285"/>' +
      '<g stroke="#4FB3B8" stroke-width="1.4" opacity=".7"><path d="M212 44h42M212 56h34M212 68h42M212 80h28M212 92h38"/></g>' +
      '<path d="M212 110h32" stroke="#F0A63C" stroke-width="1.6"/>' +
      '<text x="34" y="18" fill="#5F7183" font-family="monospace" font-size="9">RADIOGRAPHIC FILM</text>' +
      '<text x="200" y="18" fill="#5F7183" font-family="monospace" font-size="9">DIGITAL RECORD</text></svg>',

    pipeline:
      '<svg viewBox="0 0 300 150" aria-hidden="true"><rect width="300" height="150" fill="#0B1116"/>' +
      '<g stroke="#5E7285" stroke-width="7" fill="none" opacity=".85"><path d="M22 118h74V64h80v38h102"/></g>' +
      '<g stroke="#8FA6BD" stroke-width="1.2" fill="none" opacity=".45"><path d="M22 118h74V64h80v38h102"/></g>' +
      '<rect x="88" y="56" width="16" height="16" fill="#24313F" stroke="#8FA6BD"/>' +
      '<rect x="168" y="94" width="16" height="16" fill="#24313F" stroke="#8FA6BD"/>' +
      '<path d="M136 64V30" stroke="#5E7285" stroke-width="5"/><path d="M120 30h32" stroke="#5E7285" stroke-width="5"/>' +
      '<circle cx="136" cy="64" r="9" fill="#141C25" stroke="#F0A63C" stroke-width="1.6"/>' +
      '<path d="M136 55v18M127 64h18" stroke="#F0A63C" stroke-width="1.3"/>' +
      '<g fill="#4FB3B8" opacity=".7"><circle cx="60" cy="118" r="2.5"/><circle cx="228" cy="102" r="2.5"/></g></svg>'
  };

  /* ---------- AR device ---------- */
  var AR_DEVICE =
    '<svg viewBox="0 0 470 372" aria-hidden="true"><rect width="470" height="372" fill="#0B1116"/>' +
    '<g stroke="#141C25" stroke-width="1"><path d="M0 40h470M0 100h470M0 160h470M0 220h470M0 280h470M0 340h470M60 0v372M140 0v372M220 0v372M300 0v372M380 0v372"/></g>' +
    '<rect x="96" y="30" width="278" height="312" rx="14" fill="#101822" stroke="#5E7285" stroke-width="1.6"/>' +
    '<rect x="108" y="44" width="254" height="284" fill="#080D12"/>' +
    '<g stroke="#4FB3B8" stroke-width="1.2" fill="none" opacity=".85"><path d="M160 210l75-38 75 38v54l-75 38-75-38z"/><path d="M160 210l75 38 75-38M235 248v54"/></g>' +
    '<g stroke="#4FB3B8" stroke-width="1" fill="none" opacity=".45"><path d="M160 178l75-38 75 38v32M160 178v32M235 140v32"/></g>' +
    '<path d="M235 172l75 38v54l-75-38z" fill="#F0A63C" opacity=".2"/>' +
    '<path d="M235 172l75 38v54l-75-38z" fill="none" stroke="#F0A63C" stroke-width="1.8"/>' +
    '<circle cx="272" cy="218" r="7" fill="none" stroke="#F0A63C" stroke-width="1.5"/><circle cx="272" cy="218" r="2.6" fill="#F0A63C"/>' +
    '<path d="M272 211v-25h60" stroke="#F0A63C" stroke-width="1" opacity=".7" fill="none"/>' +
    '<g opacity=".55"><circle cx="196" cy="234" r="5.5" fill="none" stroke="#4FB3B8" stroke-width="1.3"/><circle cx="196" cy="234" r="2" fill="#4FB3B8"/></g>' +
    '<rect x="124" y="60" width="222" height="62" fill="#0E1620" stroke="#22303D"/>' +
    '<text x="136" y="80" fill="#F0A63C" font-family="monospace" font-size="9">COMPONENT SELECTED</text>' +
    '<g stroke="#4FB3B8" stroke-width="2" opacity=".55"><path d="M136 92h150M136 102h108M136 112h132"/></g>' +
    '<rect x="124" y="286" width="222" height="30" fill="#12100C" stroke="#F0A63C"/>' +
    '<text x="235" y="305" text-anchor="middle" fill="#F3F7FA" font-family="sans-serif" font-size="12">Step 2 of 6 — Remove housing</text>' +
    '<g stroke="#F0A63C" stroke-width="1.6" opacity=".8"><path d="M132 152h16M132 152v16M338 152h-16M338 152v16M132 312h16M132 312v-16M338 312h-16M338 312v-16"/></g>' +
    '<g stroke="#4FB3B8" stroke-width="1" opacity=".35"><path d="M28 186h68M374 186h68"/></g>' +
    '<text x="28" y="178" fill="#5F7183" font-family="monospace" font-size="9">CAMERA</text>' +
    '<text x="442" y="178" text-anchor="end" fill="#5F7183" font-family="monospace" font-size="9">OVERLAY</text></svg>';

  /* ---------- builders ---------- */

  /** horizontal step flow with arrows; last step highlighted amber */
  function flow(steps, rail, id) {
    var n = steps.length, gapW = 36, total = 1284;
    var boxW = (total - gapW * (n - 1)) / n;
    var s = '<svg viewBox="0 0 1284 ' + (rail ? 104 : 84) + '" class="flow-svg" aria-hidden="true">' +
      '<defs><marker id="' + id + '" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">' +
      '<path d="M0 0 7 4 0 8" fill="none" stroke="#F0A63C" stroke-width="1.4"/></marker></defs>';
    var top = rail ? 38 : 18;

    steps.forEach(function (st, i) {
      var x = i * (boxW + gapW), last = i === n - 1;
      var t = typeof st === 'string' ? st : st.t;
      var sub = typeof st === 'string' ? null : st.s;
      s += '<rect x="' + x + '" y="' + top + '" width="' + boxW + '" height="48" fill="' +
        (last ? '#12100C' : '#101822') + '" stroke="' + (last ? '#F0A63C' : '#2A3846') + '"/>';
      s += '<text x="' + (x + boxW / 2) + '" y="' + (top + (sub ? 20 : 29)) + '" text-anchor="middle" fill="' +
        (last ? '#F3F7FA' : '#C3CEDA') + '" font-family="IBM Plex Sans,sans-serif" font-size="13">' + esc(t) + '</text>';
      if (sub) s += '<text x="' + (x + boxW / 2) + '" y="' + (top + 36) + '" text-anchor="middle" fill="' +
        (last ? '#F0A63C' : '#5F7183') + '" font-family="IBM Plex Mono,monospace" font-size="10">' + esc(sub) + '</text>';
      if (!last) s += '<path d="M' + (x + boxW + 4) + ' ' + (top + 24) + 'h' + (gapW - 12) +
        '" stroke="#F0A63C" stroke-width="1.3" marker-end="url(#' + id + ')"/>';
    });

    if (rail) {
      s += '<path d="M' + (boxW / 2) + ' ' + top + 'V16h' + (total - boxW) + 'v' + (top - 16) +
        '" stroke="#2A3846" stroke-width="1" stroke-dasharray="3 4" fill="none"/>';
      s += '<text x="' + (total / 2) + '" y="10" text-anchor="middle" fill="#4A5B6C" font-family="IBM Plex Mono,monospace" font-size="9.5">' + esc(rail) + '</text>';
    }
    return s + '</svg>';
  }

  /** ASNT certificate film strip */
  function filmStrip(items) {
    var W = 1344, H = 208, pad = 14, gap = 12;
    var fw = (W - pad * 2 - gap * (items.length - 1)) / items.length;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="film" aria-hidden="true">' +
      '<rect width="' + W + '" height="' + H + '" fill="#0C1218" stroke="#22303D"/>' +
      '<rect width="' + W + '" height="18" fill="#0A0E12"/><rect y="' + (H - 18) + '" width="' + W + '" height="18" fill="#0A0E12"/>';
    for (var x = 14; x < W - 16; x += 40) {
      s += '<rect x="' + x + '" y="4" width="16" height="10" rx="2" fill="#1B2531"/>' +
           '<rect x="' + x + '" y="' + (H - 14) + '" width="16" height="10" rx="2" fill="#1B2531"/>';
    }
    items.forEach(function (it, i) {
      var x = pad + i * (fw + gap), cx = x + fw / 2;
      var fs = it.code.length > 3 ? 34 : it.code.length > 2 ? 38 : 44;
      s += '<rect x="' + x + '" y="26" width="' + fw + '" height="156" fill="#101A22" stroke="#2C3E4A"/>' +
        '<text x="' + cx + '" y="102" text-anchor="middle" fill="#F0A63C" font-family="Archivo,sans-serif" font-size="' + fs + '" font-weight="800">' + esc(it.code) + '</text>' +
        '<text x="' + cx + '" y="128" text-anchor="middle" fill="#8494A5" font-family="IBM Plex Sans,sans-serif" font-size="12.5">' + esc(it.name) + '</text>' +
        '<text x="' + cx + '" y="160" text-anchor="middle" fill="#3A4A5B" font-family="IBM Plex Mono,monospace" font-size="9">CERT No. [ ]</text>';
    });
    return s + '</svg>';
  }

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  w.ART = {
    STAGE: STAGE, NDT: NDT, ICON: ICON, PROJ: PROJ, AR_DEVICE: AR_DEVICE,
    flow: flow, filmStrip: filmStrip, esc: esc
  };
})(window);
