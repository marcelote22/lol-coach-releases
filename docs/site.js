// Versao, tamanho e SHA-256 do instalador atual, lidos da ultima release do GitHub.
// Assinatura: quando o plano.json do repositorio de releases tiver os links, os botoes aparecem sozinhos.
const REPO = 'marcelote22/lol-coach-releases';
const ARQUIVO = 'LoLCoach-Completo-Setup.exe';

fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
  .then((r) => (r.ok ? r.json() : null))
  .then((rel) => {
    const a = rel?.assets?.find((x) => x.name === ARQUIVO);
    if (!a) return;
    const mb = Math.round(a.size / 1e6);
    const data = new Date(rel.published_at).toLocaleDateString('pt-BR');
    document.getElementById('versao').textContent = `Versão ${rel.tag_name.replace(/^v/, '')} · ${data} · ${mb} MB · Windows 10 e 11, 64 bits · português, inglês e espanhol`;
    const sha = String(a.digest ?? '').replace(/^sha256:/, '');
    if (/^[a-f0-9]{64}$/.test(sha)) document.getElementById('hash').textContent = sha.toUpperCase();
    else document.getElementById('hash').textContent = 'Veja na página da versão, no GitHub.';
  })
  .catch(() => { document.getElementById('hash').textContent = 'Veja na página da versão, no GitHub.'; });

fetch(`https://raw.githubusercontent.com/${REPO}/main/plano.json`, { cache: 'no-store' })
  .then((r) => (r.ok ? r.json() : null))
  .then((p) => {
    if (!p?.cobrar) return;
    const ok = (u) => typeof u === 'string' && u.startsWith('https://');
    const links = [['mensal', 'Assinar mensal'], ['anual', 'Assinar 1 ano']].filter(([k]) => ok(p.assinar?.[k]));
    if (!links.length) return;
    const box = document.getElementById('assinar');
    box.className = 'acoes';
    box.replaceChildren(...links.map(([k, t], i) => {
      const a = document.createElement('a');
      a.className = i ? 'botao vazado' : 'botao';
      a.href = p.assinar[k];
      a.textContent = t;
      return a;
    }));
  })
  .catch(() => {});
