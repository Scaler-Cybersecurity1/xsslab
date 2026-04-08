# XSS Vulnerable Training Website

This project is an intentionally vulnerable website for learning Cross-Site Scripting (XSS) in a controlled local environment.

## Safety

- Use only on your own machine (`localhost`).

## Setup

```bash
npm install
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

## Labs Included

1. **Reflected XSS**: `/lab/reflected`
2. **Stored XSS**: `/lab/stored`
3. **DOM XSS**: `/lab/dom`

Each lab displays a `success_code` when the vulnerability is exploited with the expected marker string.

## Success Codes

- Reflected: `XSS-REFLECTED-7A91`
- Stored: `XSS-STORED-3F22`
- DOM: `XSS-DOM-9BC0`
