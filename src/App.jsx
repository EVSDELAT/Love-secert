import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Lock, Unlock, Gift, Plus, Trash2, Key, Copy, Eye, EyeOff, Volume2, VolumeX, Shield, Zap, Hash, X, Sparkles, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Encryption Algorithms ---
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function aesEncrypt(text, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text));
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0); combined.set(iv, 16); combined.set(new Uint8Array(encrypted), 28);
  return 'AES:' + btoa(String.fromCharCode(...combined));
}

async function aesDecrypt(encoded, password) {
  const combined = new Uint8Array(atob(encoded.replace('AES:', '')).split('').map(c => c.charCodeAt(0)));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined.slice(28));
  return new TextDecoder().decode(decrypted);
}

const b64Encrypt = (text) => 'B64:' + btoa(unescape(encodeURIComponent(text)));
const b64Decrypt = (encoded) => decodeURIComponent(escape(atob(encoded.replace('B64:', ''))));

const caesarDecipher = (str, shift) => str.replace('CSR:', '').split('').map(c => String.fromCharCode(c.charCodeAt(0) - shift)).join('');

const _getM = () => atob('NTIwMTMxNA=='); // 5201314 的混淆讀取
const MASTER_PWD = _getM();

// --- App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('creator');
  const [algo, setAlgo] = useState('AES');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [qaList, setQaList] = useState([{ id: Date.now(), q: '', a: '' }]);
  const [vaultCode, setVaultCode] = useState('');

  const [readerCode, setReaderCode] = useState('');
  const [readerPass, setReaderPass] = useState('');
  const [decryptedData, setDecryptedData] = useState(null);

  const [surprisePass, setSurprisePass] = useState('');
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [surpriseClicks, setSurpriseClicks] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [versionClicks, setVersionClicks] = useState(0);
  const [footerText, setFooterText] = useState('Version 5.2.0');
  const [modalClicks, setModalClicks] = useState(0);
  const [show1314, setShow1314] = useState(false);
  const [youtubeMusicId] = useState(''); 
  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [activeDecryptedMusicId, setActiveDecryptedMusicId] = useState('');
  const [personalClicks, setPersonalClicks] = useState(0);
  const [isMusicInputVisible, setIsMusicInputVisible] = useState(false);
  const [passwordHint, setPasswordHint] = useState('');

  const surpriseText0420 = `擔心說了這些會後悔 有些事不做或許未來更遺憾\n If I had enough time and the opportunity, I’d really love to see you.`; // 預設內容
  const surpriseText0520 = `這段文字，原本應該是一張由我親手轉交給你的卡片。但因為我擔心送到你手中時會超過我們520也是認識一個月的時間，所以決定先讓你看這些內容，在先用文字傳給你。
能夠認識你，是我這28年生命以來最幸運的事；也是這近半年多日子以來，唯一讓我真正感到開心、感動而且得到深深慰藉的事。一開始，我是被你的外貌、很甜的聲音還有獨特的個性吸引，這完全在我原訂的人生計畫之外，卻讓我深深著迷，甚至主動想靠近你。沒想到，從個性、喜好、三觀到感情觀，我們竟然意外地非常契合，而且很快就確認了彼此的心意。
從我第一次動手幫女友煮紅豆湯，還有大半夜特地跑去買魚湯的材料，就只為了等待你的到來。其實我自己也不知道為什麼會這樣，畢竟之前這麼多年的她們，也從來沒有過這些待遇。這或許就是靈魂互相吸引吧？還是因為我也能深刻感受到，你對這段感情也是非常認真的。
從桃園到台南，我們認識到今天剛好滿一個月，竟然把遠距離談得像近距離一樣能這麼頻繁的約會。剛認識的那幾天，無論是在遊戲裡還是在電話中，我們每一次都能聊上好幾個小時。那種相處的感覺非常自然、非常舒服，根本不需要刻意去找話題。
你出現在我最脆弱、最需要平安與力量的時候。如果不是你的出現給了我走下去的希望，或許我在 Q 生日過後就徹底消失了吧。而我，總能從你注視我的溫柔眼神、還有你的肢體動作中，察覺到你那些細微卻充滿愛意的變化，從這裡面感受到你對我的愛。
這一個月來，你其實做了好多好多讓我非常感動的事。每一次的感動我都記得非常清楚、牢記在心。我由衷希望你能全心接受我所經歷過的這些過去，並且願意站在我的立場、我的情緒替我想，陪我一起完成對 Q 的承諾。面對你的時候，我能毫無保留地告訴你所有對 Q 的想法和愧疚，而每一次你都能溫柔地接住我——這是我最感動的事。
還記得在溜冰場的時候，你牽著我的手，讓我從一開始的緊張，到最後能很放鬆地跟你一起並肩滑冰。這也是我最喜歡你的一點，只要有你在身邊，就像是我們在一起就能解決眼前所有的問題；只要你在我身邊，我是真的很安心。這幾天我們一起入睡的夜晚，真的是我這半年以來，極少數很有安全感、能安然入睡的時候。我很喜歡你緊緊抱我的感覺，能從你的眼神和身體的溫度，感受到你滿滿的愛。最後，我也能感覺到你總是想買所有我喜歡的東西。雖然我都要你不要為此亂花錢，但我是真的感受到你對我的好。
假如未來的哪天我真的惹你生氣了想先在這裡替未來的我道個歉希望你能原諒那時候的我我可能有時候吃醋或是覺得不安時讓你生氣了，之前在電話中有時候會短暫的沉默了一下就是擔心不小心說了什麼無法挽回又傷了害我們之間感情的話
其實在我的心裡，我已經徹底認定了你就是能夠完整我靈魂的另一半。所以呢，請你一定要為了我照顧好自己的身體，特別是現在身上的病，一定要按時乖乖吃藥。以後只要需要抽血、你害怕的時候，我都會在你身旁，絕對不會丟下你一個人。會一直陪著你，直到你恢復成原本健康而且正到爆的樣子。我真的已沒辦法再承受一次失去的痛了，別再拋下我一個人。
信的末尾，我很感謝你對我的所有包容。謝謝你願意為我做許多你之前對其他男友都從沒做過的事。只要你沒丟下我，我一定會用盡所有能力，在往後的日子裡陪你走到最後。
2026.04.20 ~ 2026.05.20
我們的故事，未完待續。    愛你的炫炫`;

  const [currentSurpriseText, setCurrentSurpriseText] = useState(surpriseText0420);
  const [loveLetterPage, setLoveLetterPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (surprisePass === '0420') {
      setCurrentSurpriseText(surpriseText0420);
      setLoveLetterPage(0);
      setIsSurpriseOpen(true);
      setSurprisePass(''); // 重置以便再次輸入
    } else if (surprisePass === '0520') {
      setCurrentSurpriseText(surpriseText0520);
      setLoveLetterPage(0);
      setIsSurpriseOpen(true);
      setSurprisePass('');
    }
  }, [surprisePass]);

  const pages = useMemo(() => {
    const chunks = [];
    let remaining = currentSurpriseText;
    const MAX_LEN = isMobile ? 120 : 220;

    while (remaining.trim().length > 0) {
      if (remaining.length <= MAX_LEN) {
        chunks.push(remaining);
        break;
      }
      
      let cutIndex = MAX_LEN;
      const lastNewline = remaining.lastIndexOf('\n', MAX_LEN);
      
      if (lastNewline > MAX_LEN * 0.5) {
        cutIndex = lastNewline + 1;
      } else {
        const strongPuncs = ['。', '！', '？'];
        let lastStrong = -1;
        for (let p of strongPuncs) {
          lastStrong = Math.max(lastStrong, remaining.lastIndexOf(p, MAX_LEN));
        }
        
        if (lastStrong > MAX_LEN * 0.6) {
          cutIndex = lastStrong + 1;
        } else {
          const weakPuncs = ['，', '、', '；'];
          let lastWeak = -1;
          for (let p of weakPuncs) {
            lastWeak = Math.max(lastWeak, remaining.lastIndexOf(p, MAX_LEN));
          }
          if (lastWeak > MAX_LEN * 0.7) {
            cutIndex = lastWeak + 1;
          }
        }
      }
      
      chunks.push(remaining.slice(0, cutIndex));
      remaining = remaining.slice(cutIndex);
    }

    const formatChunk = (chunkStr) => {
      return chunkStr.split('\n').filter(p => p.trim() !== '');
    };
    
    if (!isMobile) {
      const spreads = [];
      for (let i = 0; i < chunks.length; i += 2) {
        spreads.push([formatChunk(chunks[i]), formatChunk(chunks[i+1] || "")]);
      }
      return spreads;
    }
    return chunks.map(chunk => [formatChunk(chunk)]);
  }, [currentSurpriseText, isMobile]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const addQa = () => { setQaList([...qaList, { id: Date.now(), q: '', a: '' }]); };
  const removeQa = (id) => { setQaList(qaList.filter(item => item.id !== id)); };
  const updateQa = (id, field, val) => {
    setQaList(qaList.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleGenerate = async () => {
    if (algo !== 'B64' && !password) { return alert('此方法需要設定密碼'); }
    
    // 擷取 YouTube ID
    let musicId = '';
    if (customMusicUrl) {
      const match = customMusicUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/embed\/|\/v\/))([^?&"'>]+)/);
      musicId = match ? match[1] : '';
    }

    const data = JSON.stringify({ items: qaList, musicId, ts: Date.now() });
    try {
      let result = '';
      if (algo === 'AES') {
        const userPart = await aesEncrypt(data, password);
        const masterPart = await aesEncrypt(data, MASTER_PWD);
        const combined = btoa(`${userPart.replace('AES:', '')}.${masterPart.replace('AES:', '')}`);
        result = `AES:${combined}`;
      } else if (algo === 'B64') {
        result = b64Encrypt(data);
      } else if (algo === 'CSR') {
        result = caesarCipher(data, 5);
      }
      
      let finalVaultCode = '';
      if (passwordHint) {
        finalVaultCode = `${result}|${btoa(encodeURIComponent(passwordHint))}`;
      } else {
        finalVaultCode = result;
      }

      setVaultCode(finalVaultCode);
      
      // 自動複製到剪貼簿
      try {
        await navigator.clipboard.writeText(finalVaultCode);
        // 可以選擇性給個微小的提示或動畫，但使用者要求是「按下即複製」
      } catch (err) {
        console.error('自動複製失敗', err);
      }
    } catch (e) { alert('加密失敗'); }
  };

  const handleUnlock = async () => {
    if (!readerCode) return alert('請貼上代碼');
    try {
      let decryptedText = '';
      
      // 1. 先分離密碼提示 (如果有)
      const [mainPart, hintPart] = readerCode.split('|');
      
      // 深度偽裝解析邏輯
      if (mainPart.startsWith('AES:')) {
        const rawContent = mainPart.replace('AES:', '');
        try {
          // 嘗試解開外層封裝
          const decoded = atob(rawContent);
          if (decoded.includes('.')) {
            const [uPart, mPart] = decoded.split('.');
            if (readerPass === MASTER_PWD) {
              decryptedText = await aesDecrypt(`AES:${mPart}`, MASTER_PWD);
            } else {
              decryptedText = await aesDecrypt(`AES:${uPart}`, readerPass);
            }
          } else {
            // 相容於舊版單層加密
            decryptedText = await aesDecrypt(mainPart, readerPass);
          }
        } catch (e) {
          // 如果外層解析失敗，嘗試直接作為單層加密處理
          decryptedText = await aesDecrypt(mainPart, readerPass);
        }
      } else if (mainPart.startsWith('B64:')) {
        decryptedText = b64Decrypt(mainPart);
      } else if (mainPart.startsWith('CSR:')) {
        decryptedText = caesarDecipher(mainPart, 5);
      }

      const parsed = JSON.parse(decryptedText);
      setDecryptedData(parsed); 
      if (parsed.musicId) setActiveDecryptedMusicId(parsed.musicId);
    } catch (e) { alert('密碼錯誤或代碼格式不符'); }
  };

  return (
    <div className="app-container">
      <div className="bg-dynamic-glow" />
      
      {/* 全域背景音樂 (僅限解密成功後啟動) */}
      {decryptedData && activeDecryptedMusicId && (
        <div style={{ display: 'none' }}>
          <iframe
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${activeDecryptedMusicId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${activeDecryptedMusicId}&enablejsapi=1`}
            allow="autoplay"
          ></iframe>
        </div>
      )}

      {/* Surprise Popup Modal */}
      <AnimatePresence>
        {isSurpriseOpen && (
          <motion.div
            className="surprise-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSurpriseOpen(false)}
          >
            <motion.div
              className="surprise-modal-content love-letter-modal"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => { setIsSurpriseOpen(false); setModalClicks(0); setShow1314(false); }}>
                <X size={24} />
              </button>

              <div className="love-letter-header">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const next = modalClicks + 1;
                    setModalClicks(next);
                    if (next >= 3) setShow1314(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <PenTool size={48} className="modal-icon-premium love-pen" />
                </motion.div>
                <h3 className="modal-title-premium love-title">Love Letter</h3>
              </div>

              <AnimatePresence>
                {show1314 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="easter-egg-1314"
                  >
                    1314
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="love-letter-card-container">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={loveLetterPage}
                    initial={{ opacity: 0, rotateY: 30, x: 20, transformOrigin: "left" }}
                    animate={{ opacity: 1, rotateY: 0, x: 0, transformOrigin: "left" }}
                    exit={{ opacity: 0, rotateY: -30, x: -20, transformOrigin: "left" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="love-letter-spread"
                  >
                    {pages[loveLetterPage]?.map((column, colIdx) => (
                      <div key={colIdx} className="love-letter-column">
                        {column.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="love-letter-pagination">
                <button 
                  className={`page-btn ${loveLetterPage === 0 ? 'disabled' : ''}`}
                  onClick={() => setLoveLetterPage(Math.max(0, loveLetterPage - 1))}
                  disabled={loveLetterPage === 0}
                  title="上一頁"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="page-indicator-wrapper">
                  <span className="page-indicator">Page {loveLetterPage + 1} of {pages.length}</span>
                </div>
                <button 
                  className={`page-btn ${loveLetterPage >= pages.length - 1 ? 'disabled' : ''}`}
                  onClick={() => setLoveLetterPage(Math.min(pages.length - 1, loveLetterPage + 1))}
                  disabled={loveLetterPage >= pages.length - 1}
                  title="下一頁"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="page-header">
        <div className="header-titles">
          <h2>炫炫's Secret</h2>
          <p className="subtitle-en">Pisces' love is in the details</p>
        </div>
      </header>

      <section className="main-card">
        <aside className="sidebar">
          <div className="brand-section">
            <h1 
              className="brand-title" 
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => {
                const next = personalClicks + 1;
                setPersonalClicks(next);
                if (next >= 3) setIsMusicInputVisible(true);
              }}
            >
              PERSONAL
            </h1>
            <span className="brand-secret">SECRET</span>
          </div>
          <nav className="nav-list">
            {['creator', 'reader', 'surprise'].map((tab) => (
              <button
                key={tab}
                className={`mode-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'creator' && <Lock size={18} stroke={activeTab === tab ? "url(#premium-grad)" : "currentColor"} />}
                {tab === 'reader' && <Unlock size={18} stroke={activeTab === tab ? "url(#premium-grad)" : "currentColor"} />}
                {tab === 'surprise' && <Gift size={18} stroke={activeTab === tab ? "url(#premium-grad)" : "currentColor"} />}
                <span>{tab === 'creator' ? '建立' : tab === 'reader' ? '開啟' : '驚喜'}</span>
              </button>
            ))}
          </nav>
          {/* Removed sidebar-footer to prevent duplication in mobile dock */}
        </aside>

        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} className="section-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {activeTab === 'creator' && (
                <div className="compact-layout">
                  <div className="algo-selector">
                    <label>加密協議 / ALGORITHM</label>
                    <div className="algo-grid">
                      <button className={algo === 'AES' ? 'selected' : ''} onClick={() => setAlgo('AES')}>AES-256 GCM</button>
                      <button className={algo === 'B64' ? 'selected' : ''} onClick={() => setAlgo('B64')}>Base64 Lite</button>
                      <button className={algo === 'CSR' ? 'selected' : ''} onClick={() => setAlgo('CSR')}>Caesar Classic</button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isMusicInputVisible && (
                      <motion.div 
                        className="input-group"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <label><Volume2 size={16} /> 背景音樂 / YT LINK (選填)</label>
                        <input 
                          type="text" 
                          value={customMusicUrl} 
                          onChange={(e) => setCustomMusicUrl(e.target.value)} 
                          className="glass-input small" 
                          placeholder="貼上 YouTube 網址或影片 ID..." 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {algo !== 'B64' && (
                    <>
                      <div className="input-group">
                        <label>通解密碼 / MASTER PASS</label>
                        <div className="relative-container">
                          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input small pr-icon" placeholder="輸入解密用的主密碼..." />
                          <button className="input-icon-btn" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="input-group">
                        <label><Sparkles size={14} /> 密碼提示 / HINT (選填)</label>
                        <input 
                          type="text" 
                          value={passwordHint} 
                          onChange={(e) => setPasswordHint(e.target.value)} 
                          className="glass-input small" 
                          placeholder="給對方的一點線索..." 
                        />
                      </div>
                    </>
                  )}

                  <div className="qa-section">
                    <label>加密清單 / DATA LIST</label>
                    <div className="qa-scroll-area">
                      {qaList.map((item, idx) => (
                        <div key={item.id} className="qa-card-premium">
                          <div className="qa-line question">
                            <span className="qa-tag">Q</span>
                            <input placeholder="輸入問題內容..." value={item.q} onChange={(e) => updateQa(item.id, 'q', e.target.value)} />
                          </div>
                          <div className="qa-line answer">
                            <span className="qa-tag">A</span>
                            <input placeholder="秘密答案..." value={item.a} onChange={(e) => updateQa(item.id, 'a', e.target.value)} />
                            <button onClick={() => removeQa(item.id)} className="qa-delete-btn"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="dashed-btn" onClick={addQa}><Plus size={14} /> 新增問答項</button>
                  </div>

                  <button className="primary-btn small" onClick={handleGenerate}>加密內容 / ENCRYPT CONTENT</button>

                  {vaultCode && (
                    <div className="result-area-compact">
                      <label>生成的字串 / RESULT</label>
                      <div className="relative-container">
                        <textarea value={vaultCode} readOnly className="code-font" />
                        <button className="copy-overlay" onClick={() => { navigator.clipboard.writeText(vaultCode); alert('已複製'); }}>複製</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reader' && (
                <div className="compact-layout">
                  <div className="input-group">
                    <label>保險櫃代碼 / VAULT STRING</label>
                    <textarea value={readerCode} onChange={(e) => setReaderCode(e.target.value)} className="glass-textarea small code-font" placeholder="貼上加密字串..." />
                  </div>
                  <div className="input-group">
                    <label>密鑰驗證 / AUTH</label>
                    <input type="password" value={readerPass} onChange={(e) => setReaderPass(e.target.value)} className="glass-input small" placeholder="輸入解鎖密語..." />
                    
                    {/* 密碼提示顯示 */}
                    {readerCode && readerCode.includes('|') && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="password-hint-bubble"
                      >
                        <Sparkles size={12} className="hint-icon" />
                        <span>提示：{decodeURIComponent(atob(readerCode.split('|')[1]))}</span>
                      </motion.div>
                    )}
                  </div>
                  <button className="primary-btn small" onClick={handleUnlock}><Unlock size={16} /> 解密 / DECRYPT</button>

                  {decryptedData && (
                    <div className="decrypted-scrollable">
                      {decryptedData.items.map((item, i) => (
                        <div key={i} className="reveal-compact-premium">
                          <div className="q-row"><span>Question</span> {item.q}</div>
                          <div className="a-row"><span>Answer</span> {item.a}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'surprise' && (
                <div className="surprise-view-centered">
                  <div
                    className="surprise-icon-wrapper-premium"
                    onClick={() => {
                      const newClicks = surpriseClicks + 1;
                      setSurpriseClicks(newClicks);
                      if (newClicks >= 3) setShowHint(true);
                    }}
                  >
                    <div className="icon-halo"></div>
                    {/* Unique light flare for high-end refractive effect */}
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      left: '15%',
                      width: '6px',
                      height: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      filter: 'blur(3px)',
                      boxShadow: '0 0 15px #fff',
                      zIndex: 3
                    }}></div>
                    <Gift size={72} strokeWidth={1.2} className="gift-glow-icon-v2" style={{ stroke: 'url(#premium-grad)', fill: 'none' }} />
                  </div>

                  <div className="surprise-glass-card">
                    <h3 className="surprise-title-premium">Pisces Emphasize</h3>
                    <p className="surprise-subtitle">Gifts & Surprises</p>

                    <div className="surprise-input-wrapper-v2">
                      <input
                        type="password"
                        value={surprisePass}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSurprisePass(val);
                          // 使用 Base64 混淆比對 (MDQyMA== = 0420, MDUyMA== = 0520)
                          if (window.btoa(val) === 'MDQyMA==') {
                            setCurrentSurpriseText(surpriseText0420);
                            setIsSurpriseOpen(true);
                            setSurprisePass('');
                          } else if (window.btoa(val) === 'MDUyMA==') {
                            setCurrentSurpriseText(surpriseText0520);
                            setIsSurpriseOpen(true);
                            setSurprisePass('');
                          }
                        }}
                        placeholder="Master Password"
                        className="surprise-fancy-input-v2"
                      />
                    </div>

                    <p className={`surprise-hint-v2 ${showHint ? 'visible' : ''}`}>
                      The First Day We Met
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <footer
            className="footer-mobile-integrated"
            style={{ cursor: 'pointer', marginTop: '4rem', paddingBottom: '2rem', textAlign: 'center', opacity: 0.3 }}
          >
            <span
              onClick={() => {
                const next = versionClicks + 1;
                setVersionClicks(next);
                if (next >= 3) {
                  setFooterText('我也蠻喜歡你的 ');
                  setVersionClicks(0);
                  setTimeout(() => setFooterText('Version 5.2.0'), 3000);
                }
              }}
              style={{ pointerEvents: 'auto', fontSize: '0.55rem', letterSpacing: '0.2em' }}
            >
              <div>Powered By EVS-ZHAO TECH© 2026</div>
              <div style={{ marginTop: '0.5rem', color: footerText.includes('喜歡') ? 'var(--accent-color)' : 'inherit', opacity: footerText.includes('喜歡') ? 1 : 0.8 }}>
                {footerText}
              </div>
            </span>
          </footer>
        </main>
      </section>

      {/* Desktop-only footer logic: Only renders if window width is likely desktop or not on mobile */}
      <footer
        className="footer desktop-footer"
        style={{ cursor: 'pointer' }}
      >
        <span
          onClick={() => {
            const next = versionClicks + 1;
            setVersionClicks(next);
            if (next >= 3) {
              setFooterText('我也蠻喜歡你的 ');
              setVersionClicks(0);
              setTimeout(() => setFooterText('Version 5.2.0'), 3000);
            }
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <div>Powered By EVS-ZHAO TECH© 2026</div>
          <div style={{ marginTop: '0.4rem', color: footerText.includes('喜歡') ? 'var(--accent-color)' : 'inherit' }}>
            {footerText}
          </div>
        </span>
      </footer>

      {/* Premium SVG Gradients Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="premium-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8b5cf6' }} />
            <stop offset="100%" style={{ stopColor: '#ec4899' }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
