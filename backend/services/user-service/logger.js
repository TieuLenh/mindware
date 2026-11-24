const c = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};

function getDateString(date = new Date(), timeZone = "Asia/Ho_Chi_Minh") {
  // Trả về dạng YYYY-MM-DD (dùng en-CA vì chuẩn ISO YYYY-MM-DD)
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTimeString(date = new Date(), timeZone = "Asia/Ho_Chi_Minh") {
  // Trả về dạng HH:mm:ss (24h)
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

class TerminalLog{

    static style(content = '', stype = ''){
        if(Array.isArray(stype)){
            return (`${
                stype.map(val => (
                    c[val] ?? ''
                )).join('')
            }${content}${c.reset}`);
        }
        
        if(typeof stype === 'string'){
            switch(stype.toLocaleLowerCase()){
                case 'importance':
                    return `${c.green}${content}${c.reset}`
                case 'error':
                    return `${c.red}${content}${c.reset}`
                case 'warning':
                    return `${c.yellow}${content}${c.reset}`
                default:
                    return `${c.reset}${content}`
            }
        }

        return content
    }

    static write(content, stype = 'note', showDate = false, showTime = true){
        console.log(
            `[${
                showDate && getDateString() || ''
            }${
                showDate && showTime && ' | ' || ''
            }${
                showTime && getTimeString() || ''
            }]: ${TerminalLog.style(content, stype)}`)
    }

    static error(content){
        TerminalLog.write(content, 'error')
    }
    // web
    static getClientInfo(req) {
        // Nếu Gateway nằm sau reverse proxy (Nginx, Cloudflare...) và đã cấu hình app.set('trust proxy', true)
        // thì req.ip sẽ tự ưu tiên X-Forwarded-For; nếu không thì fallback về socket.remoteAddress
        const rawIp = req.ip || req.socket?.remoteAddress || 'unknown';
        const ip = rawIp.replace(/^::ffff:/, ''); // Chuẩn hóa IPv4-mapped IPv6 (::ffff:127.0.0.1 -> 127.0.0.1)

        return {
            ip,
            ips: req.ips, // Danh sách IP nếu có proxy chain (khi trust proxy được bật)
            method: req.method,
            url: req.originalUrl,
            origin: req.headers.origin || null,
            referer: req.headers.referer || null,
            userAgent: req.headers['user-agent'] || 'unknown',
            host: req.headers.host || null,
        };
    }
}


module.exports = TerminalLog