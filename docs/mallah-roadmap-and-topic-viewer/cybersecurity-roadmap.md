# Mallah — Cybersecurity & Ethical Hacking Path
## Full Roadmap Specification (with Resources & Certificates)

**Path ID:** `cybersecurity`
**Estimated Duration:** 8–12 months (at 1–2 hrs/day)
**Difficulty:** Beginner → Advanced
**Philosophy:** Cybersecurity is learned by doing — but always legally, always ethically, always in controlled environments. Every topic is practiced in lab platforms (TryHackMe, Hack The Box, DVWA, Metasploitable) designed for exactly this purpose. The learner who understands *why* a vulnerability exists defends against it far better than one who only knows how to run a tool. This path builds both the offensive mindset and the defensive understanding.

**Stack / Tools:** Linux (Kali) · Bash · Python · Nmap · Wireshark · Burp Suite · Metasploit · SQLMap · John the Ripper · Hydra · Gobuster · OWASP ZAP · Netcat · TryHackMe · Hack The Box

> ⚠️ **Legal Notice (displayed permanently in path UI):** All techniques taught in this path must only be practised on systems you own, systems you have explicit written permission to test, or dedicated legal lab platforms (TryHackMe, Hack The Box, DVWA, etc.). Unauthorised access to computer systems is illegal in every jurisdiction. Mallah takes no responsibility for misuse of any content in this path.

---

## Resource Format Guide (for agent parsing)

```
- [VIDEO] Title — Channel/Author — URL
- [ARTICLE] Title — Source — URL
- [INTERNAL_TEXT] Short inline explanation (no URL — rendered inline in Topic Viewer)
```

Certificate block format:
```
- [CERT] Title — Provider — URL — cost_type — cost_note
```

---

## Path Overview

| Stage | Title | Topics | Project / Lab |
|-------|-------|---------|---------------|
| 1 | Foundations: Networking & Operating Systems | 7 | Home Lab Setup |
| 2 | Linux & Command Line Mastery | 6 | Bash Automation Toolkit |
| 3 | Security Fundamentals & Cryptography | 6 | Security Audit Report |
| 4 | Network Security & Traffic Analysis | 6 | Network Recon Lab |
| 5 | Web Application Security (Offensive) | 7 | Web Pentest Report |
| 6 | System Exploitation & Post-Exploitation | 6 | Full Pentest Simulation |
| 7 | Blue Team: Defence, Detection & Response | 5 | SOC Analyst Lab |
| 8 | CTF, Bug Bounty & Capstone | 5 | Public CTF Write-Up + Bug Bounty Report |

**Total:** 48 topics · 8 projects/labs · 30 skills unlocked

---

## Stage 1 — Foundations: Networking & Operating Systems
**Tagline:** You cannot attack or defend what you don't understand. Build the mental model of how computers talk to each other.
**Duration:** ~3 weeks
**Legal note:** All topics in this stage are conceptual and setup-focused. No offensive tools are used yet.

---

### Topic 1.1 — How Networks Work: The OSI & TCP/IP Models
**Type:** Concept + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** The OSI 7-layer model and TCP/IP 4-layer model. What each layer does. Data encapsulation. IP addresses (IPv4, IPv6), subnetting basics (CIDR notation). DNS, DHCP, ARP — what they do and why they matter to security. Ports: well-known, registered, dynamic.

**Practical Output:** Use the [TryHackMe Pre-Security path](https://tryhackme.com/path/outline/presecurity) — complete the "Network Fundamentals" module. Write a one-page summary: given IP 192.168.1.50/24, determine the network address, broadcast address, and number of usable hosts. Explain what happens step-by-step when you type google.com in a browser.

**Skills Unlocked:**
- Networking (`fundamentals`) — `beginner`

**Resources:**
- [VIDEO] Networking Fundamentals — Professor Messer — https://www.youtube.com/watch?v=0uflG0SemyM
- [ARTICLE] The OSI Model — CompTIA — https://www.comptia.org/content/guides/what-is-the-osi-model
- [INTERNAL_TEXT] The OSI model isn't just exam fodder — it's a debugging framework. When something doesn't work on a network, you work down from Layer 7 (is the application configured correctly?) to Layer 1 (is the cable plugged in?). When something is being attacked, you think about which layer the attack targets. SQL injection is a Layer 7 attack. ARP poisoning is Layer 2. SYN floods are Layer 4. This mental model makes every security concept you encounter make sense immediately.

---

### Topic 1.2 — Protocols That Matter for Security: HTTP, HTTPS, DNS, FTP, SSH, SMTP
**Type:** Concept + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** How HTTP/HTTPS work: request-response, methods (GET/POST/PUT/DELETE), headers, cookies, status codes. How HTTPS/TLS protects traffic. DNS as an attack vector (DNS poisoning, DNS hijacking). FTP plaintext dangers. SSH key-based auth. SMTP and email attack vectors. How to read network packets.

**Practical Output:** TryHackMe — "How the Web Works" module. Then manually construct and send an HTTP GET request to `httpbin.org` using only `netcat` (raw TCP connection, no browser). Observe the raw response. Explain what headers reveal about the server.

**Skills Unlocked:**
- Networking (`fundamentals`) — `beginner`
- HTTP basics (`fundamentals`) — `beginner`

**Resources:**
- [VIDEO] HTTP Explained — NetworkChuck — https://www.youtube.com/watch?v=iYM2zFP3Zn0
- [ARTICLE] HTTP Overview — MDN — https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
- [INTERNAL_TEXT] HTTP headers are gold for an attacker: `Server: Apache/2.2.17` reveals a version from 2010 with known CVEs. `X-Powered-By: PHP/5.3.6` tells you the entire backend stack. Most headers that make a defender's life easier (CSP, HSTS, X-Frame-Options) are absent on poorly configured sites. Understanding exactly what information HTTP exposes is the first step to understanding web application security — both attacking and hardening.

---

### Topic 1.3 — Operating Systems: Windows & Linux Security Architecture
**Type:** Concept + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Windows security model: NTFS permissions, User Account Control (UAC), Windows Registry, Active Directory basics, Windows Event Logs, PowerShell. Linux security model: users/groups, permissions (rwx), sudo, /etc/passwd and /etc/shadow, processes, cron jobs. Why both matter to ethical hackers.

**Practical Output:** TryHackMe — "Windows Fundamentals" and "Linux Fundamentals" modules. On a Linux VM: find all files owned by root with SUID bit set (`find / -perm -4000`). Explain what SUID means and why a misconfigured SUID binary is a privilege escalation vulnerability.

**Skills Unlocked:**
- Linux (`platform_service`) — `beginner`
- Windows (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Linux for Hackers — NetworkChuck — https://www.youtube.com/watch?v=VbEx7B_PTOE
- [ARTICLE] Linux File Permissions — The Linux Command Line (free book) — https://linuxcommand.org/lc3_lts0090.php
- [INTERNAL_TEXT] Every professional penetration tester is fluent in both Windows and Linux because real-world networks run both. Windows dominates corporate environments (Active Directory, Exchange, IIS). Linux dominates servers, cloud infrastructure, and IoT. SUID binaries are a classic Linux privilege escalation vector — when a binary runs as root regardless of who executes it, a bug in that binary can be exploited to get a root shell. GTFOBins (gtfobins.github.io) is the reference for commonly abused SUID binaries.

---

### Topic 1.4 — Virtualisation & Building Your Home Lab
**Type:** Setup + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Why a home lab? Virtualisation: VirtualBox (free) or VMware. Setting up Kali Linux as an attacker machine. Setting up intentionally vulnerable VMs: Metasploitable2, DVWA (Damn Vulnerable Web Application). Network isolation: internal network vs NAT vs bridged. Snapshots for safe practice.

**Practical Output:** Set up a home lab with VirtualBox containing: (1) Kali Linux VM, (2) Metasploitable2 VM. Configure both on an "internal network" so they can talk to each other but not the internet. Take a snapshot of each. Verify connectivity by pinging Metasploitable from Kali. Document your lab setup in a README with a network diagram.

**Skills Unlocked:**
- Virtualisation (`tool`) — `beginner`
- Kali Linux (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Build an Ethical Hacking Home Lab — NetworkChuck — https://www.youtube.com/watch?v=mvsiSHjbNvA
- [ARTICLE] Kali Linux Download & VM setup — kali.org — https://www.kali.org/get-kali/
- [INTERNAL_TEXT] Your home lab is the most important investment in this path. Having your own attack-and-defend environment means you can experiment freely without fear of legal consequences or breaking anything real. The Metasploitable VM is intentionally full of vulnerabilities — it exists specifically for this purpose. Every technique you'll learn in Stages 4–6 will be practised here first before you go to TryHackMe or HackTheBox challenges. Always restore from a snapshot before a new exercise — this gives you a clean target every time.

---

### Topic 1.5 — The Ethical Hacking Framework: Methodology & Legal Foundations
**Type:** Concept
**Estimated Time:** 1–1.5 hrs
**Difficulty:** Beginner

**Description:** The five phases of ethical hacking: Reconnaissance → Scanning → Gaining Access → Maintaining Access → Covering Tracks. Scope and rules of engagement. Types of pentesting: black box, grey box, white box. Legal frameworks: Computer Fraud and Abuse Act (US), Computer Misuse Act (UK), and equivalent. Bug bounty programs: what they are, how they work, what legal protections they provide. CVE, CWE, CVSS scoring.

**Practical Output:** Read a real penetration testing report (OWASP has published anonymised examples). Write a mock "rules of engagement" document for a hypothetical pentest of a fictional company — scope definition, exclusions, reporting requirements, legal sign-off requirements.

**Skills Unlocked:**
- Security Fundamentals (`practice`) — `beginner`
- Ethical Hacking Methodology (`practice`) — `beginner`

**Resources:**
- [VIDEO] Ethical Hacking Full Course Introduction — TCM Security — https://www.youtube.com/watch?v=3Kq1MIfTWCE
- [ARTICLE] OWASP Testing Guide — https://owasp.org/www-project-web-security-testing-guide/
- [INTERNAL_TEXT] Methodology matters more than tools. A professional penetration tester follows a repeatable, documented process — not "run tools until something interesting happens." Every engagement starts with a written scope agreement that defines exactly what can and cannot be tested. Scanning a server not listed in scope — even accidentally — is a breach of contract and potentially illegal. Bug bounty programs are the closest thing to practicing legally on real production systems: companies explicitly invite researchers to find vulnerabilities in defined scopes.

---

### Topic 1.6 — Python & Bash for Security Scripting
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Why scripting matters for security professionals. Bash: for loops, conditionals, variables, reading files, piping, cron. Python: file handling, `socket` module, `requests` library, subprocess, parsing JSON. Automating repetitive security tasks. Writing a simple port scanner in Python.

**Practical Output:** Write a Python port scanner that: takes a target IP and port range as arguments, attempts TCP connection to each port, reports open/closed/filtered, and logs results to a timestamped file. Must complete a scan of 100 ports in under 5 seconds using threading. **Only test against your own Metasploitable VM.**

**Skills Unlocked:**
- Python (`language`) — `beginner`
- Bash (`language`) — `beginner`
- Scripting (`practice`) — `beginner`

**Resources:**
- [VIDEO] Python for Ethical Hacking — TCM Security — https://www.youtube.com/watch?v=XWuP5Yf5ILI
- [ARTICLE] Python socket module — docs.python.org — https://docs.python.org/3/library/socket.html
- [INTERNAL_TEXT] Security professionals who can script are 10x more effective than those who can't. A port scanner that takes 3 minutes manually takes 3 seconds in a loop. A password wordlist that has 100,000 entries needs automation to process. More importantly, understanding how tools like Nmap work internally — they're all built on the same socket connections you'll write here — makes you a better user of those tools when something unexpected happens.

---

### Topic 1.7 — PROJECT: Home Lab Setup & Documentation
**Type:** Project (Milestone)
**Difficulty:** Beginner
**Estimated Time:** 4–6 hrs

**Description:** Document and demonstrate your home lab environment — the foundation for every hands-on exercise in this path.

**Requirements:**
- VirtualBox with Kali Linux + Metasploitable2 VMs running on an isolated internal network
- Network diagram showing the lab topology (IP addresses, hostnames, network type)
- DVWA installed and accessible via browser from Kali
- All VMs snapshotted at a clean baseline
- Kali tool verification: Nmap, Wireshark, Burp Suite, Metasploit all launch successfully
- A written "Lab Rules" document: what you will and won't do in this environment, and why
- All documentation pushed to a **private** GitHub repo (note: security lab docs should not be public)
- TryHackMe Pre-Security path progress: at least 50% complete

**Skills Demonstrated:**
- Virtualisation (`tool`) — `beginner`
- Kali Linux (`platform_service`) — `beginner`
- Networking (`fundamentals`) — `beginner`
- Bash (`language`) — `beginner`

**Resources:**
- [VIDEO] Complete Home Lab Tutorial — David Bombal — https://www.youtube.com/watch?v=LqRqvkGEiSA
- [INTERNAL_TEXT] Your GitHub repo for this path should be **private** — not because the content is secret, but because public repositories documenting hacking techniques, even against lab environments, can be misinterpreted and attract the wrong attention. Keep lab notes, pentest reports, and tool configurations private. Your portfolio pieces for this path are CTF write-ups and bug bounty reports — those can be public, because they document findings on systems you were explicitly authorised to test.

---

## Stage 2 — Linux & Command Line Mastery
**Tagline:** Every professional security tool runs on Linux. Master the command line and you master the toolkit.
**Duration:** ~2 weeks

---

### Topic 2.1 — Linux Command Line Deep Dive
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** File system navigation: `ls`, `cd`, `pwd`, `find`, `locate`. File operations: `cp`, `mv`, `rm`, `mkdir`, `cat`, `less`, `head`, `tail`. Text processing: `grep`, `awk`, `sed`, `cut`, `sort`, `uniq`. Piping and redirection. Process management: `ps`, `top`, `htop`, `kill`. Package management: `apt`. Wildcards and regular expressions.

**Practical Output:** Complete TryHackMe "Linux Fundamentals" parts 1–3. Then in Kali: find all files modified in the last 24 hours (`find / -mtime -1`), filter out errors, sort by size, and save the top 20 to a file — all as a single pipeline. Explain each part of the pipeline.

**Skills Unlocked:**
- Linux (`platform_service`) — `beginner` → `intermediate`
- Bash (`language`) — `intermediate`

**Resources:**
- [VIDEO] Linux Command Line Tutorial — freeCodeCamp — https://www.youtube.com/watch?v=ZtqBQ68cfJc
- [ARTICLE] The Linux Command Line (free book) — linuxcommand.org — https://linuxcommand.org/tlcl.php
- [INTERNAL_TEXT] The Linux command line is the primary interface for almost every security tool you'll use. Burp Suite, Metasploit, Nmap, Wireshark — all configurable and automatable via the terminal. The pipeline (`|`) is the most powerful concept: connect tools so the output of one becomes the input of another. `nmap -p 80 10.0.0.0/24 | grep "open" | cut -d' ' -f6` finds all machines with port 80 open and extracts just their IPs — useful for targeting web servers in a pentest.

---

### Topic 2.2 — Linux File Permissions, Users & Privilege Escalation Concepts
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** `chmod`, `chown`, `chgrp`. SUID, SGID, sticky bit. `/etc/passwd`, `/etc/shadow` — structure and what hashed passwords look like. `sudo` configuration (`/etc/sudoers`). Weak sudo rules as a privilege escalation vector. `crontab` misuse. World-writable directories.

**Practical Output:** On your Metasploitable VM (after gaining a low-privilege shell via netcat — set this up manually): find at least 3 potential privilege escalation vectors using `LinPEAS` (automated Linux enumeration script). Document each finding and explain why it's a vulnerability. **Lab environment only.**

**Skills Unlocked:**
- Linux (`platform_service`) — `intermediate`
- Privilege Escalation (`practice`) — `beginner`

**Resources:**
- [VIDEO] Linux Privilege Escalation — TCM Security — https://www.youtube.com/watch?v=ZTsbGpDwCRQ
- [ARTICLE] GTFOBins — https://gtfobins.github.io/
- [INTERNAL_TEXT] Privilege escalation is the art of going from a limited user account to full root/administrator access. In real penetration tests, you almost never get direct root access — you get a foothold as a low-privilege user and then escalate. Understanding *why* each privesc vector works (SUID lets a binary run as its owner regardless of who executes it; a misconfigured sudo rule lets you run a program as root) makes you both a better attacker and a better defender who knows what to audit.

---

### Topic 2.3 — Bash Scripting for Security Automation
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Variables, conditionals, loops, functions, arguments. Reading input. File I/O. Running system commands from scripts. Error handling. Practical security use cases: log parsing, automated scanning, alerting.

**Practical Output:** Write a Bash script that: takes a subnet (e.g. `192.168.1.0/24`) as an argument, pings each host, reports which are alive, then runs a quick Nmap scan on alive hosts, and outputs a timestamped report file. **Only run against your home lab network.**

**Skills Unlocked:**
- Bash (`language`) — `intermediate`
- Scripting (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Bash Scripting Tutorial — NetworkChuck — https://www.youtube.com/watch?v=SPwyp2NG-bE
- [ARTICLE] Bash Guide — The Linux Documentation Project — https://tldp.org/LDP/Bash-Beginners-Guide/html/
- [INTERNAL_TEXT] Security automation is not just about saving time — it's about reproducibility. A Bash script that runs the same enumeration steps every time is more reliable than a human remembering to run each tool manually. In real penetration tests, automated reconnaissance scripts run during the first phase to gather as much information as possible before a human starts making decisions. Learning to write them teaches you both what information matters and how to collect it systematically.

---

### Topic 2.4 — Networking Tools: Netcat, SSH Tunnelling & Port Forwarding
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Netcat ("the Swiss Army knife"): connecting, listening, file transfer, bind and reverse shells. SSH: key generation, agent forwarding, local port forwarding (`-L`), remote port forwarding (`-R`), dynamic SOCKS proxy (`-D`). Why these matter for penetration testers (pivoting, tunnelling through firewalls).

**Practical Output:** In your home lab: set up a Netcat listener on Metasploitable, connect from Kali, transfer a file, and set up a simple bind shell. Then use SSH local port forwarding to access a service on Metasploitable through an SSH tunnel from Kali. Document every command used. **Lab environment only.**

**Skills Unlocked:**
- Network Tools (`tool`) — `beginner`
- Linux (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Netcat Tutorial — John Hammond — https://www.youtube.com/watch?v=J9lwGDP7sqI
- [ARTICLE] SSH Tunneling Explained — ssh.com — https://www.ssh.com/academy/ssh/tunneling
- [INTERNAL_TEXT] Netcat is 30 years old and still used in real penetration tests daily. Its simplicity is its power — it's a raw TCP/UDP Swiss Army knife. A reverse shell is what you set up when a target machine can't accept incoming connections (firewall blocks inbound) but can make outbound connections: the target connects back to your listener, giving you a shell. SSH tunnelling solves a different problem: accessing an internal service that's only reachable from inside a network, by tunnelling through an SSH-accessible host.

---

### Topic 2.5 — Python for Offensive Security
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** `socket` for raw network connections. `requests` for HTTP interaction and fuzzing. `scapy` for packet crafting. Regular expressions for parsing tool output. Writing a basic vulnerability scanner. Automating Burp Suite via its API.

**Practical Output:** Write a Python script that: (1) takes a URL and a wordlist as arguments, (2) brute-forces directories using `requests` (similar to Gobuster), (3) reports all URLs returning status 200 or 301, (4) logs results to a timestamped file. Test only against DVWA in your home lab.

**Skills Unlocked:**
- Python (`language`) — `intermediate`
- Scripting (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Python Hacking Tools — Hak5 — https://www.youtube.com/watch?v=Fd1Mq06xd0E
- [ARTICLE] Scapy Documentation — scapy.net — https://scapy.readthedocs.io/en/latest/
- [INTERNAL_TEXT] Understanding how tools like Gobuster, SQLMap, and Hydra work by building simplified versions yourself is the fastest way to master them. When you've built a directory brute-forcer yourself, you understand exactly what Gobuster is doing — and you understand why certain wordlists are more effective, why response codes matter, and what false positives look like. This understanding separates tool operators from security professionals.

---

### Topic 2.6 — PROJECT: Bash Automation Toolkit
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 6–8 hrs

**Description:** Build a personal security automation toolkit in Bash and Python — tools you'll actually use in the rest of this path.

**Requirements (all tools tested only in your home lab):**
- `recon.sh`: takes an IP/hostname, runs Nmap scan, saves report in a dated folder
- `alive.sh`: takes a subnet, pings all hosts, returns a list of live IPs
- `dirscan.py`: Python directory brute-forcer (HTTP 200/301 reporting, threaded, wordlist-based)
- `portscan.py`: Python port scanner with service banner grabbing (threaded, outputs JSON)
- All tools accept `--help` flags and validate inputs
- A `README.md` documenting each tool, usage examples, and sample output
- Pushed to a **private** GitHub repo

**Skills Demonstrated:**
- Bash (`language`) — `intermediate`
- Python (`language`) — `intermediate`
- Scripting (`practice`) — `intermediate`
- Linux (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Build Hacking Tools with Python — TCM Security — https://www.youtube.com/watch?v=XWuP5Yf5ILI
- [INTERNAL_TEXT] Your automation toolkit is a living asset — add to it throughout the path whenever you find yourself repeating a task. Security professionals maintain personal toolkits that evolve with their knowledge. The fact that you built these tools yourself means you understand exactly what they're doing under the hood — which makes you a far more effective security professional than someone who only knows how to run pre-built tools.

---

## Stage 3 — Security Fundamentals & Cryptography
**Tagline:** Understand what you're protecting, how it breaks, and why cryptography is the foundation of all trust online.
**Duration:** ~2 weeks

---

### Topic 3.1 — The CIA Triad & Security Principles
**Type:** Concept
**Estimated Time:** 1–1.5 hrs
**Difficulty:** Beginner

**Description:** Confidentiality, Integrity, Availability — and what attacks on each look like. Authentication vs Authorisation vs Accounting (AAA). Least privilege, defence in depth, separation of duties. Attack types: active vs passive, insider vs outsider. NIST Cybersecurity Framework 2.0: Identify, Protect, Detect, Respond, Recover.

**Practical Output:** For 5 common cyberattacks (ransomware, phishing, SQL injection, DDoS, man-in-the-middle), map each to: which CIA principle it violates, what phase of the attack lifecycle it occurs in, and what control would prevent or detect it. Present as a structured table.

**Skills Unlocked:**
- Security Fundamentals (`practice`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] CIA Triad Explained — Professor Messer — https://www.youtube.com/watch?v=Y01jdl_5YGE
- [ARTICLE] NIST Cybersecurity Framework — nist.gov — https://www.nist.gov/cyberframework
- [INTERNAL_TEXT] The CIA triad is the lens through which every security decision is made. A security control that protects Confidentiality might hurt Availability (encryption slows systems). A control that maximises Availability might weaken Integrity (no backups because "it slows deployment"). Security is always about tradeoffs — understanding the triad gives you the vocabulary to discuss those tradeoffs precisely. The NIST CSF is what enterprise security teams use to structure their entire security programme — knowing it sets you apart from candidates who only know tools.

---

### Topic 3.2 — Cryptography: Encryption, Hashing & TLS
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Symmetric encryption: AES — how it works, key sizes, modes (CBC, GCM). Asymmetric encryption: RSA, elliptic curve — public/private key pairs, key exchange. Hashing: SHA-256, MD5 (deprecated) — properties, salting, rainbow tables. Digital signatures. TLS handshake step by step. PKI: certificates, CAs, certificate chains.

**Practical Output:** Using Python's `cryptography` library: (1) Encrypt and decrypt a message using AES-256-GCM, (2) Generate an RSA keypair, sign a message, verify the signature, (3) Hash a password with `bcrypt` (with salt), compare hashes. Then analyse an expired SSL certificate using `openssl s_client -connect` — identify the CA chain, expiry date, and cipher suite.

**Skills Unlocked:**
- Cryptography (`practice`) — `beginner`
- Security Fundamentals (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Cryptography Explained — Computerphile — https://www.youtube.com/watch?v=AQDCe585Lnc
- [ARTICLE] TLS 1.3 Explained — Cloudflare Blog — https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/
- [INTERNAL_TEXT] Cryptography is the foundation of everything secure online. HTTPS, SSH, VPNs, password storage, digital signing — all rooted in the same mathematical principles. The most important practical points for security professionals: MD5 and SHA-1 are broken for security purposes (collision attacks exist). Passwords must never be hashed without salting — salts prevent rainbow table attacks. AES-GCM provides both encryption and integrity verification in one. TLS 1.3 removed all the weak cipher suites that made TLS 1.0/1.1/1.2 vulnerable — knowing *why* they were removed tells you what to look for when auditing servers.

---

### Topic 3.3 — Common Attack Patterns: OWASP Top 10 Overview
**Type:** Concept + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Overview of OWASP Top 10 2021: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Software Integrity Failures, Logging Failures, SSRF. What each means practically and how each is exploited.

**Practical Output:** TryHackMe — "OWASP Top 10" room. For each of the 10 categories, write a one-sentence description of: the vulnerability, a real-world example (CVE or breach), and one mitigation. Keep it in your security notes — this becomes your reference for the entire path.

**Skills Unlocked:**
- Security Fundamentals (`practice`) — `intermediate`
- Ethical Hacking Methodology (`practice`) — `intermediate`

**Resources:**
- [VIDEO] OWASP Top 10 Explained — Web Dev Simplified — https://www.youtube.com/watch?v=t0bFucmK9N0
- [ARTICLE] OWASP Top 10 — owasp.org — https://owasp.org/Top10/
- [INTERNAL_TEXT] The OWASP Top 10 is the industry-standard list of the most critical web application security risks, updated every 3–4 years based on real-world breach data. It's not just a list — it's a checklist for every web application you'll ever assess. "Broken Access Control" (now #1) means a user can access data or functions they shouldn't be able to. This sounds obvious, but it's the most common vulnerability found in real applications because developers rarely think adversarially when building access control logic.

---

### Topic 3.4 — Threat Modelling & Vulnerability Management
**Type:** Concept + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Intermediate

**Description:** STRIDE threat model (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege). Vulnerability scanning vs penetration testing. CVE and NVD databases. CVSS scoring: base, temporal, environmental. Reading vulnerability advisories. Responsible disclosure process.

**Practical Output:** Perform a STRIDE threat model for a simple three-tier web application (browser → web server → database). Identify at least 2 threats per STRIDE category. Assign a CVSS score to the 3 most critical threats and explain your scoring. Look up the CVEs for 3 known vulnerabilities in common software (e.g. Apache Log4Shell, Heartbleed, EternalBlue) and explain what each allowed an attacker to do.

**Skills Unlocked:**
- Security Fundamentals (`practice`) — `advanced`
- Ethical Hacking Methodology (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Threat Modelling — Adam Shostack — https://www.youtube.com/watch?v=v3otnmkMGWo
- [ARTICLE] CVSS v3.1 Specification — first.org — https://www.first.org/cvss/specification-document
- [INTERNAL_TEXT] Threat modelling is how security professionals think *before* building or testing a system. STRIDE forces you to consider every category of threat systematically — you can't just focus on the obvious ones. Spoofing: can someone pretend to be another user? Tampering: can someone modify data in transit or at rest? Repudiation: can an attacker deny they performed an action because there are no logs? CVSS scores let you prioritise which vulnerabilities to fix first — a CVSS 9.8 RCE vulnerability (remote code execution, no authentication required) gets fixed before a CVSS 3.1 information disclosure.

---

### Topic 3.5 — Password Security: Hashing, Cracking & Best Practices
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** How password hashes are stored. Hash types: MD5, NTLM, SHA-1, bcrypt, Argon2. Rainbow tables. Dictionary attacks vs brute force vs rule-based attacks. John the Ripper basics. Hashcat basics. `rockyou.txt` wordlist. Password managers and MFA as defences.

**Practical Output:** Using John the Ripper in your home lab: crack the MD5 hashes from `/etc/shadow` on Metasploitable using the `rockyou.txt` wordlist. Identify how many passwords were cracked and how long it took. Explain why the cracked passwords were weak and what password policy would have prevented each. **Lab environment only — never attempt to crack hashes from systems you don't own.**

**Skills Unlocked:**
- Password Attacks (`practice`) — `beginner`
- Cryptography (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Password Cracking — TCM Security — https://www.youtube.com/watch?v=JCPfMW9DQRY
- [ARTICLE] John the Ripper Documentation — https://www.openwall.com/john/doc/
- [INTERNAL_TEXT] Password cracking in a home lab teaches you something crucial: most users choose passwords from a small, predictable set. The `rockyou.txt` wordlist (14 million passwords from a 2009 breach) cracks a shocking percentage of MD5-hashed passwords in minutes. This is why password managers (which generate truly random passwords) are necessary — a random 16-character password won't appear in any wordlist. As a defender, the lesson is clear: bcrypt with a work factor of 12+ takes hours or years to crack even with GPU acceleration. MD5 takes minutes.

---

### Topic 3.6 — PROJECT: Security Audit Report
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 6–8 hrs

**Description:** Conduct a structured security review of your home lab environment and produce a professional-style report.

**Requirements (home lab systems only):**
- STRIDE threat model for your lab's three-tier setup (Kali → network → Metasploitable)
- Document the following for Metasploitable: open ports and services found (from Topic 4 preview), 5 known CVEs applicable to services found, CVSS scores for each, suggested mitigations
- Password audit: crack hashes from Metasploitable shadow file, calculate cracking time, recommend a hardened password policy
- Cryptography audit: check which services use plaintext protocols (FTP, Telnet), recommend encrypted alternatives
- Report format: Executive Summary (1 page, non-technical), Findings (technical detail), Risk Rating, Recommendations
- Saved as PDF, kept in your **private** repo

**Skills Demonstrated:**
- Security Fundamentals (`practice`) — `advanced`
- Ethical Hacking Methodology (`practice`) — `intermediate`
- Cryptography (`practice`) — `intermediate`

**Resources:**
- [ARTICLE] Sample pentest report format — PTES — http://www.pentest-standard.org/index.php/Reporting
- [INTERNAL_TEXT] The ability to write a clear, professional security report is what separates a real penetration tester from someone who runs tools. Clients don't read Nmap output — they read executive summaries. A finding without a clear risk rating, business impact, and remediation recommendation is nearly worthless. This report format — Executive Summary → Findings → Recommendations — is what professional pentest reports look like at every major security firm. Practice it now so it becomes natural.

---

## Stage 4 — Network Security & Traffic Analysis
**Tagline:** See everything on the wire. Scan, enumerate, and understand what's running before you ever try to exploit it.
**Duration:** ~2.5 weeks

---

### Topic 4.1 — Nmap: Network Scanning & Enumeration
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Nmap scan types: TCP SYN (`-sS`), TCP connect (`-sT`), UDP (`-sU`). OS detection (`-O`). Service version detection (`-sV`). Nmap Scripting Engine (NSE): using and writing scripts. Timing and stealth: `-T0` through `-T5`. Output formats: normal, XML, grepable. Scanning from TryHackMe vs home lab.

**Practical Output:** Scan Metasploitable with Nmap: (1) discover all open ports, (2) detect service versions, (3) identify the OS, (4) run NSE vulnerability scripts (`--script vuln`). Save results in all formats. Write a target profile: services found, versions, known CVEs for each. **Lab and authorised platforms only.**

**Skills Unlocked:**
- Nmap (`tool`) — `intermediate`
- Network Reconnaissance (`practice`) — `beginner`

**Resources:**
- [VIDEO] Nmap Tutorial — NetworkChuck — https://www.youtube.com/watch?v=4t4kBkMsDbQ
- [ARTICLE] Nmap Official Guide — nmap.org — https://nmap.org/book/man.html
- [INTERNAL_TEXT] Nmap is the first tool a penetration tester runs against a target. The goal of scanning is to build a complete picture: what's running, what versions, what OS. Every piece of version information is a potential CVE. Running `--script vuln` on Metasploitable is a revealing exercise — it will find known CVEs including MS08-067 (EternalBlue precursor), vsftpd backdoor, and UnrealIRCd backdoor — all intentionally included in Metasploitable for learning purposes.

---

### Topic 4.2 — Wireshark: Packet Capture & Traffic Analysis
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Capturing traffic (interface selection, capture filters). Display filters: `ip.addr`, `tcp.port`, `http`, `dns`. Following TCP streams. Protocol dissection: HTTP, DNS, FTP (seeing plaintext credentials). Exporting objects (files from HTTP captures). Identifying suspicious patterns: port scans, brute force, C2 beacons.

**Practical Output:** In your home lab: (1) Capture traffic while running an Nmap scan from Kali to Metasploitable — identify what a port scan looks like in Wireshark. (2) Capture FTP traffic and extract the plaintext username/password. (3) Capture an HTTP login on DVWA and extract credentials. (4) Identify what a TCP SYN scan looks like vs a TCP connect scan.

**Skills Unlocked:**
- Wireshark (`tool`) — `intermediate`
- Network Analysis (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Wireshark Tutorial — David Bombal — https://www.youtube.com/watch?v=lb1Dw0elw0Q
- [ARTICLE] Wireshark User Guide — wireshark.org — https://www.wireshark.org/docs/wsug_html_chunked/
- [INTERNAL_TEXT] Wireshark teaches you what "plaintext protocol" really means: FTP sends your username and password as readable text — any device between you and the server can see them. This is why FTP should never be used over untrusted networks (use SFTP or SCP instead). Seeing a login captured in Wireshark as `USER admin PASS password123` makes the risk concrete in a way that reading about it never does. Traffic analysis skills are essential for both offense (understanding what traffic your tools generate) and defense (detecting attacker activity).

---

### Topic 4.3 — Enumeration: SMB, FTP, SSH, SMTP & Web Services
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Service enumeration beyond port scanning. SMB: `enum4linux`, `smbclient`, null sessions, share enumeration. FTP: anonymous login, banner grabbing. SSH: version fingerprinting, user enumeration. SMTP: `VRFY` and `EXPN` for user enumeration. Web: HTTP header analysis, directory brute-forcing with Gobuster.

**Practical Output:** Against Metasploitable: run full service enumeration. Find: all SMB shares (including any with guest access), FTP anonymous login files, any users enumerable via SMTP. Use Gobuster to brute-force DVWA's directories. Document every finding. **Lab only.**

**Skills Unlocked:**
- Network Reconnaissance (`practice`) — `intermediate`
- Enumeration (`practice`) — `beginner`

**Resources:**
- [VIDEO] Network Enumeration — TCM Security — https://www.youtube.com/watch?v=f1f2C7Ufn3s
- [ARTICLE] Penetration Testing Execution Standard (PTES) — http://www.pentest-standard.org/
- [INTERNAL_TEXT] Enumeration is the most important phase of a penetration test. You can't exploit what you haven't found. `enum4linux` against a Windows SMB share has revealed sensitive documents left in world-readable shares in real penetration tests. Anonymous FTP login finding a password file has compromised real companies. The rule: before you try a single exploit, enumerate everything. The path from nothing to full access almost always runs through information gathered during enumeration, not through a zero-day exploit.

---

### Topic 4.4 — Vulnerability Scanning with OpenVAS & Nikto
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Automated vulnerability scanners vs manual penetration testing. OpenVAS/Greenbone: setting up, running a full scan, interpreting results. Nikto for web server scanning. False positives and why scanners aren't enough. Integrating scanner results into a pentest workflow.

**Practical Output:** Run an OpenVAS scan against Metasploitable. Run a Nikto scan against DVWA. Export both reports. Triage the findings: mark each as true positive, false positive, or "needs manual verification." Write a one-paragraph analyst note on the 3 most critical findings. **Lab only.**

**Skills Unlocked:**
- Vulnerability Assessment (`practice`) — `beginner`
- Enumeration (`practice`) — `intermediate`

**Resources:**
- [VIDEO] OpenVAS Tutorial — TCM Security — https://www.youtube.com/watch?v=OkN1JFQr4xM
- [ARTICLE] Greenbone OpenVAS — greenbone.net — https://www.greenbone.net/en/vulnerability-management/
- [INTERNAL_TEXT] Vulnerability scanners are a starting point, not an ending point. OpenVAS will flag known CVEs for the services Nmap discovered — but it will also produce false positives (things that look vulnerable but aren't, due to patched versions reporting old banners) and miss context-dependent vulnerabilities (business logic flaws, access control issues). A real penetration test uses scanners to find low-hanging fruit quickly, then applies manual testing to find what the scanners missed. Never submit a scanner report to a client as a "penetration test."

---

### Topic 4.5 — Wireless Security Fundamentals
**Type:** Concept + Lab (optional hardware)
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** WiFi security protocols: WEP (broken), WPA2-Personal, WPA2-Enterprise, WPA3. Evil twin attacks. WPA2 handshake capture and offline dictionary attack concept. Aircrack-ng overview. Rogue access points. Protecting wireless networks. **Note:** Practise only on your own wireless network or in a contained lab setup. Never scan or attack networks you don't own.

**Practical Output:** TryHackMe — "Wifi Hacking 101" room (uses an isolated, simulated environment). Write a one-page analysis: what makes WEP trivially broken, why WPA2-PSK with a strong passphrase is hard to crack, and what configurations make corporate WPA2-Enterprise more secure than home WPA2-Personal.

**Skills Unlocked:**
- Wireless Security (`practice`) — `beginner`

**Resources:**
- [VIDEO] WiFi Hacking Explained — NetworkChuck — https://www.youtube.com/watch?v=WfYxrLaqlN8
- [ARTICLE] WPA3 Security — Wi-Fi Alliance — https://www.wi-fi.org/discover-wi-fi/security
- [INTERNAL_TEXT] WiFi security is a cautionary tale about cryptographic design. WEP was broken within months of widespread deployment — the IV (Initialization Vector) was too short and reused, making the key recoverable after capturing enough traffic. WPA2 with a strong, random passphrase is practically uncrackable by dictionary attack. WPA2 with "home123" as a passphrase is cracked in seconds against the `rockyou.txt` wordlist. This is why the strength of the password matters as much as the strength of the protocol.

---

### Topic 4.6 — PROJECT: Network Recon Lab
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–10 hrs

**Description:** Perform complete network reconnaissance against your home lab, producing a professional recon report.

**Requirements (home lab only):**
- Full Nmap scan of your internal lab network: all ports, service versions, OS detection, NSE vuln scripts
- Wireshark capture of interesting traffic: identify at least one plaintext credential
- Full service enumeration: SMB, FTP, SSH, SMTP against Metasploitable
- Gobuster directory scan of DVWA
- OpenVAS + Nikto scans with triaged findings
- All findings compiled into a professional Reconnaissance Report:
  - Network map (diagram)
  - Service inventory table (host, port, service, version, CVEs)
  - Attack surface summary (highest-risk findings ranked by CVSS)
  - Recommendations section
- Saved as PDF in your private repo

**Skills Demonstrated:**
- Nmap (`tool`) — `intermediate`
- Wireshark (`tool`) — `intermediate`
- Network Reconnaissance (`practice`) — `intermediate`
- Enumeration (`practice`) — `intermediate`
- Vulnerability Assessment (`practice`) — `beginner`

**Resources:**
- [VIDEO] Full Network Penetration Test — TCM Security — https://www.youtube.com/watch?v=3Kq1MIfTWCE
- [INTERNAL_TEXT] This reconnaissance report is the first section of what will eventually become a full penetration test report. Professional pentest reports are built cumulatively: recon findings are summarised, then exploitation findings are added, then privilege escalation, then post-exploitation. Start building the habit now of documenting every command, every output, and every finding as you go — rebuilding a report from memory after the fact is painful and error-prone.

---

## Stage 5 — Web Application Security (Offensive)
**Tagline:** Web apps are the biggest attack surface in every organisation. Learn to find what developers miss.
**Duration:** ~3 weeks
**Platforms:** DVWA, OWASP Juice Shop, PortSwigger Web Security Academy (free, legal labs), TryHackMe

---

### Topic 5.1 — Burp Suite: Web Proxy & Interception
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Burp Suite architecture: Proxy, Scanner, Intruder, Repeater, Decoder, Comparer, Sequencer. Intercepting HTTP/HTTPS traffic. Editing requests. Sending to Repeater for manual testing. Using Intruder for automated fuzzing. Burp's passive scanner in Community Edition. Setting up FoxyProxy.

**Practical Output:** Configure Burp Suite to intercept traffic from your browser to DVWA. Capture a login request. Modify the request in Repeater to test different credentials. Use Intruder to run a credential brute-force against DVWA's login (100 common passwords). Identify the difference between a failed and successful login from the response.

**Skills Unlocked:**
- Burp Suite (`tool`) — `intermediate`
- Web Application Testing (`practice`) — `beginner`

**Resources:**
- [VIDEO] Burp Suite for Beginners — TCM Security — https://www.youtube.com/watch?v=G3hpAeoZ4ek
- [ARTICLE] Burp Suite Documentation — portswigger.net — https://portswigger.net/burp/documentation
- [INTERNAL_TEXT] Burp Suite is the most important tool for web application security testing. The Proxy sits between your browser and the server, letting you see and modify every request and response in real time. The Repeater lets you resend a modified request instantly — perfect for testing if changing a parameter value changes what data you see. The Intruder automates sending a request with many different payloads — perfect for brute-forcing, fuzzing, and parameter enumeration. 90% of web security testing flows through these three tools.

---

### Topic 5.2 — SQL Injection: Detection, Exploitation & Defence
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Intermediate

**Description:** How SQL injection works: unsanitised input becomes part of a query. Types: classic (error-based), blind (boolean and time-based), union-based, out-of-band. Manual testing with Burp Repeater. SQLMap for automated exploitation. Impact: data theft, authentication bypass, RCE (in some cases). Defence: parameterised queries (prepared statements), ORMs, WAFs.

**Practical Output:** Against DVWA (Security Level: Low): (1) manually exploit the SQL injection field to extract usernames and passwords from the database using union injection, (2) automate the same extraction with SQLMap. Then switch to Security Level: Medium — explain what protection was added and why the same techniques fail. Read the DVWA source code to understand the fix. PortSwigger Web Security Academy: complete the SQL injection labs.

**Skills Unlocked:**
- SQL Injection (`practice`) — `intermediate`
- Web Application Testing (`practice`) — `intermediate`
- Burp Suite (`tool`) — `intermediate`

**Resources:**
- [VIDEO] SQL Injection — John Hammond — https://www.youtube.com/watch?v=1nJgupaUPEQ
- [ARTICLE] SQL Injection — PortSwigger — https://portswigger.net/web-security/sql-injection
- [INTERNAL_TEXT] SQL injection has existed since 1998 and is still in OWASP's Top 10 in 2021 — because developers keep building string concatenation queries. `SELECT * FROM users WHERE username = '` + userInput + `'` is the vulnerability. Input `' OR '1'='1` and the query becomes `WHERE username = '' OR '1'='1'` — which is always true, returning all users. Parameterised queries fix this by treating user input as data, never as SQL syntax: `SELECT * FROM users WHERE username = ?` with the username passed separately. This is not a performance optimisation — it's the only correct way to build SQL queries.

---

### Topic 5.3 — Cross-Site Scripting (XSS): Reflected, Stored & DOM
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** How XSS works: injecting JavaScript into a page that other users see. Types: reflected (requires a link), stored (persists in the database, affects all users), DOM-based (client-side only). Real impact: session cookie theft, keylogging, credential harvesting, malware delivery. BeEF framework overview. Defence: output encoding, Content Security Policy (CSP).

**Practical Output:** Against DVWA: (1) execute a reflected XSS that triggers an `alert()`, (2) execute a stored XSS that steals a cookie and displays it, (3) create a stored XSS payload that redirects users to a fake login page. PortSwigger Web Security Academy: complete stored and reflected XSS labs.

**Skills Unlocked:**
- XSS (`practice`) — `intermediate`
- Web Application Testing (`practice`) — `intermediate`

**Resources:**
- [VIDEO] XSS Explained — TomNomNom — https://www.youtube.com/watch?v=ns1LX6mEvyM
- [ARTICLE] Cross-site scripting — PortSwigger — https://portswigger.net/web-security/cross-site-scripting
- [INTERNAL_TEXT] Stored XSS is the most dangerous XSS type because it requires no action from the victim beyond visiting the page. An attacker stores a malicious script in a comment field — every user who loads the page executes it. In 2019, a stored XSS in a well-known platform was used to steal session tokens from thousands of users. Content Security Policy (CSP) is the main defence: it tells the browser which scripts are allowed to execute. `Content-Security-Policy: script-src 'self'` blocks all inline scripts and scripts from external domains. Understanding the attack is what makes you implement the defence correctly.

---

### Topic 5.4 — Authentication & Session Attacks
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Insecure Direct Object References (IDOR). Session hijacking using stolen cookies. Broken authentication: credential stuffing, weak lockout policies, predictable session tokens. CSRF: forging requests as a logged-in user. Insecure "remember me" implementations. JWT attacks: `none` algorithm, weak secret brute-forcing.

**Practical Output:** Against DVWA: (1) perform a session hijacking by stealing a cookie with XSS and using it to impersonate another user, (2) find and exploit an IDOR vulnerability (access another user's profile by changing the `id` parameter). PortSwigger Web Security Academy: complete IDOR and CSRF labs.

**Skills Unlocked:**
- Web Application Testing (`practice`) — `intermediate`
- Authentication Attacks (`practice`) — `beginner`

**Resources:**
- [VIDEO] IDOR Explained — John Hammond — https://www.youtube.com/watch?v=rloqMGcPMkI
- [ARTICLE] Broken Access Control — PortSwigger — https://portswigger.net/web-security/access-control
- [INTERNAL_TEXT] IDOR (Insecure Direct Object Reference) is the most common access control vulnerability and the #1 vulnerability class in bug bounty programs. The pattern: changing `/api/users/1234/profile` to `/api/users/1235/profile` and seeing someone else's private data. It's trivially easy to find and often reveals sensitive personal information. IDOR vulnerabilities persist because developers implement authentication (is the user logged in?) but forget authorisation (should this user be allowed to access this specific resource?). These are two completely different questions.

---

### Topic 5.5 — File Inclusion, Upload & Command Injection
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Local File Inclusion (LFI): reading arbitrary files. Remote File Inclusion (RFI): executing remote code. Directory traversal (`../../../etc/passwd`). Insecure file upload: bypassing extension checks to upload PHP webshells. Command injection: injecting OS commands via web parameters (`; ls -la`). Server-Side Template Injection (SSTI) overview.

**Practical Output:** Against DVWA: (1) exploit LFI to read `/etc/passwd`, (2) bypass the file upload to upload a PHP webshell and execute commands on the server, (3) exploit command injection to run `whoami` and `id`. Explain the exact code vulnerability in each case. **Lab only.**

**Skills Unlocked:**
- Web Application Testing (`practice`) — `advanced`
- Web Exploitation (`practice`) — `beginner`

**Resources:**
- [VIDEO] File Inclusion — TCM Security — https://www.youtube.com/watch?v=19pEAe39k9s
- [ARTICLE] File path traversal — PortSwigger — https://portswigger.net/web-security/file-path-traversal
- [INTERNAL_TEXT] File upload vulnerabilities that lead to webshell execution are critically dangerous — they give an attacker code execution on the server. The bypass technique matters: if the server checks the file extension, rename `shell.php` to `shell.php.jpg`. If it checks the MIME type in the HTTP header, intercept the upload with Burp and change `image/jpeg` to `application/x-php`. If it checks for file magic bytes (the first few bytes of a file), prepend a valid JPEG header to your PHP script. Defence: never execute uploaded files, store them outside the web root, rename them to random strings, and validate both extension and content.

---

### Topic 5.6 — API Security Testing
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** REST API security: testing endpoints, authentication bypass, mass assignment, excessive data exposure. GraphQL security: introspection, batching attacks. API documentation as an attack map (Swagger/OpenAPI). Broken Object Level Authorisation (BOLA — API-specific IDOR). Fuzzing API parameters.

**Practical Output:** TryHackMe — "OWASP API Security Top 10" room. Then test an intentionally vulnerable API (e.g. Pixi from OWASP or crAPI). Find and exploit: an authentication bypass, an IDOR/BOLA, and an excessive data exposure issue. Document each finding in professional report format.

**Skills Unlocked:**
- API Security Testing (`practice`) — `beginner`
- Web Application Testing (`practice`) — `advanced`

**Resources:**
- [VIDEO] API Hacking — TCM Security — https://www.youtube.com/watch?v=qC8NQFwVOR0
- [ARTICLE] OWASP API Security Top 10 — owasp.org — https://owasp.org/API-Security/
- [INTERNAL_TEXT] APIs are the fastest-growing attack surface in web security. Every mobile app, single-page application, and microservices architecture is essentially all API. The OWASP API Security Top 10 is different from the web Top 10 because APIs have unique vulnerabilities: BOLA (can a user access objects they don't own?), mass assignment (can a user set properties they shouldn't?), excessive data exposure (does the API return everything and let the client filter?). Bug bounty programs report that BOLA accounts for the majority of API-related findings.

---

### Topic 5.7 — PROJECT: Web Pentest Report
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 12–15 hrs

**Description:** Perform a complete web application penetration test on OWASP Juice Shop (or a similar intentionally vulnerable application) and produce a professional pentest report.

**Requirements (Juice Shop is a legal, intentionally vulnerable target — run locally):**
- Complete the following OWASP Juice Shop challenges: at least 15 challenges across different categories
- Document every vulnerability found: vulnerability name, OWASP category, reproduction steps (with screenshots), CVSS score, business impact, remediation
- Produce a professional pentest report:
  - Executive Summary (for a non-technical audience)
  - Scope and Methodology
  - Findings Summary Table (sorted by severity)
  - Detailed Finding writeups
  - Remediation Roadmap
- Report format: PDF, professional layout
- Stored in your **private** GitHub repo

**Skills Demonstrated:**
- Burp Suite (`tool`) — `intermediate`
- SQL Injection (`practice`) — `intermediate`
- XSS (`practice`) — `intermediate`
- Web Application Testing (`practice`) — `advanced`
- Web Exploitation (`practice`) — `beginner`
- API Security Testing (`practice`) — `beginner`

**Resources:**
- [ARTICLE] OWASP Juice Shop — owasp.org — https://owasp.org/www-project-juice-shop/
- [VIDEO] OWASP Juice Shop Walkthrough — John Hammond — https://www.youtube.com/watch?v=0YSNRz0NytI
- [INTERNAL_TEXT] This is your first professional-grade pentest report. The format matters as much as the findings. Real pentest reports are what security professionals show to clients to justify the engagement cost and help development teams prioritise remediation. A finding described as "SQL injection in login form" is not useful. A finding described as "Unauthenticated SQL Injection in POST /api/login allows extraction of all user credentials (CVSS 9.8)" with reproduction steps, a screenshot, and remediation guidance — that is a finding.

---

## Stage 6 — System Exploitation & Post-Exploitation
**Tagline:** Gain access and understand exactly what an attacker can do once inside.
**Duration:** ~2.5 weeks
**Platforms:** Metasploitable (home lab), TryHackMe, Hack The Box

---

### Topic 6.1 — Metasploit Framework
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** Metasploit architecture: modules (exploits, payloads, auxiliaries, post). `msfconsole` workflow. Searching for exploits. `show options`, `set`, `run`. Meterpreter shell. Staged vs stageless payloads. MSFvenom for payload generation. Using Metasploit responsibly.

**Practical Output:** Against Metasploitable in your home lab: (1) use Metasploit to exploit vsftpd 2.3.4 (a backdoor intentionally left in this version), (2) use Metasploit to exploit the Samba usermap_script vulnerability, (3) get a Meterpreter shell and practice post-exploitation commands: `getuid`, `sysinfo`, `hashdump`, `upload`, `download`. Document every command. **Lab only.**

**Skills Unlocked:**
- Metasploit (`tool`) — `intermediate`
- System Exploitation (`practice`) — `beginner`

**Resources:**
- [VIDEO] Metasploit Crash Course — TCM Security — https://www.youtube.com/watch?v=TzEfV3bFfNI
- [ARTICLE] Metasploit Documentation — docs.metasploit.com — https://docs.metasploit.com/
- [INTERNAL_TEXT] Metasploit is a double-edged sword — the same framework used by professional penetration testers is also abused by script kiddies. The difference is authorisation, documentation, and understanding. When you use Metasploit in a pentest, you understand every option you're setting, you've verified the exploit is appropriate for the target version, and you're documenting every action for your report. The vsftpd 2.3.4 backdoor was a deliberate sabotage of a production software release by an unknown party — an extraordinary event that reminds us why supply chain security matters.

---

### Topic 6.2 — Windows Privilege Escalation
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** Windows privesc: unquoted service paths, weak service permissions, always install elevated, token impersonation, pass-the-hash, Mimikatz (theory and lab use). WinPEAS automated enumeration. UAC bypass techniques. Scheduled tasks as privesc vectors.

**Practical Output:** TryHackMe — "Windows Privilege Escalation" room. Use WinPEAS to enumerate a Windows target, identify the privesc path, and escalate to SYSTEM. Document each step: what you found, why it's exploitable, how you escalated, and what the fix is.

**Skills Unlocked:**
- Privilege Escalation (`practice`) — `intermediate`
- System Exploitation (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Windows Privilege Escalation — TCM Security — https://www.youtube.com/watch?v=uTcrbNBcoxQ
- [ARTICLE] PayloadsAllTheThings — Windows Privesc — https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Windows%20-%20Privilege%20Escalation.md
- [INTERNAL_TEXT] Privilege escalation is the phase between "I have a foothold" and "I have full control." In Windows environments, the most common paths are unquoted service paths (a service path with spaces and no quotes lets an attacker place a malicious binary in an intermediate directory) and token impersonation (a service account with SeImpersonatePrivilege can be exploited to impersonate SYSTEM). Mimikatz is a tool that extracts plaintext passwords and hashes from Windows memory — this is why "Credential Guard" exists in modern Windows to prevent this.

---

### Topic 6.3 — Linux Privilege Escalation
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** Linux privesc: SUID binaries, sudo misconfigurations, cron job abuse, writable `/etc/passwd`, PATH hijacking, kernel exploits, Docker breakouts. LinPEAS/Linux Smart Enumeration. Capabilities abuse.

**Practical Output:** TryHackMe — "Linux Privilege Escalation" room. Exploit at least 3 different privesc vectors on lab targets. Document each: enumeration command that found it, why it's exploitable, exploitation steps, and how to fix it.

**Skills Unlocked:**
- Privilege Escalation (`practice`) — `intermediate`
- Linux (`platform_service`) — `advanced`

**Resources:**
- [VIDEO] Linux Privilege Escalation — TCM Security — https://www.youtube.com/watch?v=ZTsbGpDwCRQ
- [ARTICLE] GTFOBins — https://gtfobins.github.io/
- [INTERNAL_TEXT] Cron job abuse is one of the most elegant Linux privesc vectors: if a cron job runs as root and references a script in a world-writable directory, you can replace that script with your own malicious one. The next time cron runs the job, your script executes as root. PATH hijacking works similarly: if a root-owned script runs a command without a full path (e.g. `ping` instead of `/bin/ping`), and you can write to a directory earlier in PATH, you can create a malicious `ping` script that runs as root. The lesson for defenders: always use full paths in scripts, and never make scripts run by privileged cron jobs world-writable.

---

### Topic 6.4 — Active Directory Attacks (Introduction)
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** What Active Directory is and why it's the crown jewel of corporate networks. Kerberos authentication basics. Attack techniques: Pass-the-Hash, Pass-the-Ticket, Kerberoasting, AS-REP Roasting, LDAP enumeration with BloodHound, DCSync. BloodHound for attack path visualisation.

**Practical Output:** TryHackMe — "Active Directory Basics" and "Attacktive Directory" rooms. Set up a small AD lab (if resources permit) or use TryHackMe's provided environment. Perform: (1) LDAP enumeration to find users and groups, (2) Kerberoasting to request and crack a service ticket, (3) use BloodHound to visualise the attack path to Domain Admin. **TryHackMe lab environment only.**

**Skills Unlocked:**
- Active Directory (`practice`) — `beginner`
- System Exploitation (`practice`) — `advanced`

**Resources:**
- [VIDEO] Active Directory Attacks — TCM Security — https://www.youtube.com/watch?v=pKtDQtsubio
- [ARTICLE] BloodHound Documentation — https://bloodhound.readthedocs.io/en/latest/
- [INTERNAL_TEXT] Active Directory is in 90%+ of corporate Windows environments. Compromising AD means compromising the entire organisation — every user account, every server, every workstation. This is why AD attacks are the focus of advanced penetration tests and red team exercises. Kerberoasting is particularly dangerous because it works with normal domain user credentials — any authenticated user can request service tickets for any SPN, and those tickets can be cracked offline. Service accounts with weak passwords and privileged access are the most valuable targets.

---

### Topic 6.5 — Post-Exploitation: Persistence, Pivoting & Covering Tracks
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** Post-exploitation goals: maintain access, move laterally, exfiltrate data. Persistence: adding backdoor users, scheduled tasks, startup scripts, Meterpreter persistence. Pivoting: using a compromised host as a jump point to reach otherwise inaccessible networks. Covering tracks: clearing logs (and why this is usually detected). Data exfiltration techniques.

**Practical Output:** TryHackMe — "Post-Exploitation Basics" room. In your home lab: after exploiting Metasploitable, set up persistence (a backdoor user and a cron-based reverse shell), demonstrate pivoting concept (add a second VM to an otherwise unreachable network), clear the bash history. Document every step and — critically — document how each persistence mechanism would be *detected* by a defender.

**Skills Unlocked:**
- Post-Exploitation (`practice`) — `beginner`
- System Exploitation (`practice`) — `advanced`

**Resources:**
- [VIDEO] Post Exploitation — John Hammond — https://www.youtube.com/watch?v=s9d7k-3kXHk
- [ARTICLE] MITRE ATT&CK Framework — attack.mitre.org — https://attack.mitre.org/
- [INTERNAL_TEXT] The MITRE ATT&CK Framework catalogues every known attacker tactic, technique, and procedure (TTP) based on real-world threat intelligence. It's the Rosetta Stone between red team (attackers) and blue team (defenders): a red teamer says "I used T1053.005 (Scheduled Task persistence)" and a blue teamer can look up exactly which log events, EDR alerts, and SIEM rules would detect it. Learning ATT&CK TTPs makes you a better attacker (you know what's realistic) and a better defender (you know what to look for).

---

### Topic 6.6 — PROJECT: Full Pentest Simulation
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 12–16 hrs

**Description:** Conduct a full, end-to-end penetration test simulation on a TryHackMe or Hack The Box machine, documented as a professional report.

**Requirements:**
- Choose a beginner/intermediate machine on TryHackMe (e.g. Blue, Basic Pentesting, HackPark) or Hack The Box (Starting Point machines)
- Document the full pentest lifecycle: Reconnaissance → Scanning → Enumeration → Exploitation → Privilege Escalation → Post-Exploitation
- Every command run is logged with its output
- Every finding is documented with: what was found, how, why it's vulnerable, CVSS score
- Produce a professional Penetration Test Report (same format as Stage 3 project but now with exploitation findings)
- Write a "Remediation Verification" section: what a defender would need to do to verify each fix
- Keep in private repo

**Skills Demonstrated:**
- Nmap (`tool`) — `intermediate`
- Metasploit (`tool`) — `intermediate`
- Burp Suite (`tool`) — `intermediate`
- System Exploitation (`practice`) — `advanced`
- Privilege Escalation (`practice`) — `intermediate`
- Post-Exploitation (`practice`) — `beginner`

**Resources:**
- [ARTICLE] TryHackMe — https://tryhackme.com/
- [ARTICLE] Hack The Box Starting Point — https://app.hackthebox.com/starting-point
- [INTERNAL_TEXT] This is your most significant portfolio piece so far. A documented, full-chain attack on an authorised platform, presented as a professional report, is exactly what employers in penetration testing look for. TryHackMe "Blue" is famous in the community — it's the MS17-010 (EternalBlue) vulnerability, the same exploit used by WannaCry ransomware. Understanding how to exploit it, and understanding how to detect it (MS17-010 traffic has distinctive patterns Wireshark can identify), puts you ahead of most candidates.

---

## Stage 7 — Blue Team: Defence, Detection & Response
**Tagline:** The best defenders have thought like attackers. Now apply that understanding to build and operate defences.
**Duration:** ~2 weeks

---

### Topic 7.1 — Security Operations & SIEM
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** What is a SOC (Security Operations Centre)? Security Information and Event Management (SIEM). Log sources: Windows Event Logs, Linux syslog, network logs, application logs. Log analysis fundamentals. Splunk basics (free tier) or Elastic Stack (ELK). Correlation rules. Writing detection rules for attacks you've already performed (Nmap scans, brute force, exploitation).

**Practical Output:** TryHackMe — "Splunk: Basics" and "Investigating with Splunk" rooms. Using Splunk or ELK in a lab: write detection rules for (1) port scan activity (many connections in short time from one IP), (2) brute force login attempts (many failed logins), (3) reverse shell indicators (outbound connection to unusual port). Alert on each.

**Skills Unlocked:**
- SIEM (`tool`) — `beginner`
- Blue Team (`practice`) — `beginner`

**Resources:**
- [VIDEO] Splunk for Beginners — John Strand (SANS) — https://www.youtube.com/watch?v=RcezOxHRxHg
- [ARTICLE] Elastic SIEM Guide — elastic.co — https://www.elastic.co/security/siem
- [INTERNAL_TEXT] Having performed all the offensive techniques in Stages 4–6, you now know exactly what to look for in logs. A port scan looks like: many SYN packets to different ports from the same source IP in a short time window. Brute force looks like: many failed authentication events followed by a success. A reverse shell looks like: an outbound TCP connection to a non-standard port, followed by a long-lived session with interactive traffic. This is why the best security analysts have offensive security knowledge — they understand what they're detecting.

---

### Topic 7.2 — Incident Response
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** The incident response lifecycle: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned. Indicators of Compromise (IoCs). Triage: triaging alert queue, distinguishing true positives from false positives. Memory forensics intro. Disk forensics intro. Writing an incident response plan.

**Practical Output:** TryHackMe — "Incident Response and Forensics" module. Analyse a simulated security incident: given a set of logs, identify the attack timeline, determine the initial access vector, document the IoCs, and write an incident report following the IR lifecycle.

**Skills Unlocked:**
- Incident Response (`practice`) — `beginner`
- Blue Team (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Incident Response — Sans Institute — https://www.youtube.com/watch?v=H-_VqVnFaCA
- [ARTICLE] NIST Incident Response Guide — https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf
- [INTERNAL_TEXT] Incident response is the most stressful and consequential work in cybersecurity. When a breach is happening or has happened, the pressure is intense: data may still be exfiltrating, management wants answers, legal is asking about notification obligations, and every minute of delay costs money and reputation. The IR lifecycle is your framework for staying systematic under pressure. "Containment before eradication" is the most important rule — you need to understand the full scope of a compromise before you start remediating, or you'll miss persistence mechanisms and the attacker will be back.

---

### Topic 7.3 — Defensive Hardening: Firewalls, IDS/IPS & Zero Trust
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Firewalls: stateful vs stateless, rule ordering, network segmentation. IDS vs IPS: signature-based vs anomaly-based. Snort/Suricata rule writing. Zero Trust Architecture: "never trust, always verify." Microsegmentation. Secure configuration baselines: CIS Benchmarks. Defence in depth.

**Practical Output:** Set up Snort or Suricata in your home lab. Write custom rules to detect: (1) Nmap SYN scan activity, (2) attempts to access the Metasploitable FTP backdoor, (3) HTTP requests containing SQL injection payloads. Test each rule by triggering the activity from Kali and confirming the alert fires.

**Skills Unlocked:**
- Network Defence (`practice`) — `beginner`
- Blue Team (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Suricata IDS Tutorial — NetworkChuck — https://www.youtube.com/watch?v=S0-vsjhPDN0
- [ARTICLE] CIS Benchmarks — cisecurity.org — https://www.cisecurity.org/cis-benchmarks
- [INTERNAL_TEXT] Writing your own Snort/Suricata rules for attacks you've personally performed is the most effective defensive learning exercise in this path. When you write a rule to detect Nmap SYN scans, you understand exactly what network signature distinguishes a scan from normal traffic. CIS Benchmarks are the industry standard for secure configuration: they define the exact settings (registry keys, file permissions, service configurations) that make Windows or Linux hardened against common attack techniques. A CIS-hardened system is significantly harder to exploit than a default installation.

---

### Topic 7.4 — Threat Intelligence & the MITRE ATT&CK Framework
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** What is cyber threat intelligence? Tactical, operational, strategic intelligence. IoC types: hashes, IPs, domains, TTPs. MITRE ATT&CK: tactics, techniques, sub-techniques, groups, software. Using ATT&CK Navigator to map detections. Threat hunting basics. OSINT for threat intelligence.

**Practical Output:** Using MITRE ATT&CK: for the attack chain you performed in Stage 6, map every technique you used to its ATT&CK ID. Use ATT&CK Navigator to create a heat map showing your attack coverage. Identify which detection data sources (Windows Event IDs, network traffic patterns, file system changes) would detect each technique.

**Skills Unlocked:**
- Threat Intelligence (`practice`) — `beginner`
- Blue Team (`practice`) — `advanced`

**Resources:**
- [VIDEO] MITRE ATT&CK Explained — John Hammond — https://www.youtube.com/watch?v=FUlBamWOThk
- [ARTICLE] MITRE ATT&CK Navigator — attack.mitre.org — https://mitre-attack.github.io/attack-navigator/
- [INTERNAL_TEXT] The MITRE ATT&CK Framework is the most important reference in modern cybersecurity defence. When a threat intelligence report says "this APT group uses T1566.001 (Spearphishing Attachment) for initial access," your detection team can immediately look up which log sources and SIEM rules would catch it. The exercise of mapping your own offensive techniques to ATT&CK IDs makes abstract technique names concrete — you've done these things, you know what they look like in practice.

---

### Topic 7.5 — PROJECT: SOC Analyst Lab
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 8–12 hrs

**Description:** Simulate the work of a SOC analyst: investigate a set of simulated security events and produce a detection and response report.

**Requirements:**
- TryHackMe: complete the "SOC Level 1" learning path (or significant portion)
- In your home lab with Splunk or ELK: generate and capture logs from a simulated attack (run your Stage 6 attack chain against Metasploitable with full logging enabled)
- Analyse the logs and produce a detection report:
  - Timeline of events (reconstruction of the attack)
  - IoCs identified (IPs, user accounts, files, ports)
  - ATT&CK TTP mapping for each detected activity
  - Detection rules written (Snort/Suricata or Splunk SPL)
  - Recommendations for hardening to prevent recurrence

**Skills Demonstrated:**
- SIEM (`tool`) — `beginner`
- Blue Team (`practice`) — `advanced`
- Incident Response (`practice`) — `beginner`
- Threat Intelligence (`practice`) — `beginner`
- Network Defence (`practice`) — `beginner`

**Resources:**
- [ARTICLE] TryHackMe SOC Level 1 Path — https://tryhackme.com/path/outline/soclevel1
- [INTERNAL_TEXT] This project bridges the two halves of this path: you performed the attack, now you detect it. The most effective security professionals in 2026 are those who understand both sides. When you write a Splunk query to detect Nmap scans, you're drawing on your first-hand experience of what Nmap traffic looks like in Wireshark. When you write an incident report, you know what questions a penetration tester would ask about the compromised system. This dual perspective is rare and highly valued by employers.

---

## Stage 8 — CTF, Bug Bounty & Capstone
**Tagline:** Take your skills to the real world — legally. Compete in CTFs and contribute to bug bounty programs.
**Duration:** ~3 weeks

---

### Topic 8.1 — Capture the Flag (CTF) Competitions
**Type:** Practical Competition
**Estimated Time:** Ongoing
**Difficulty:** Advanced

**Description:** What are CTFs? Jeopardy vs attack-defence formats. CTF categories: web, forensics, cryptography, reverse engineering, pwn (binary exploitation), OSINT, steganography. Recommended platforms: picoCTF (beginner), CTFtime.org (competition calendar), HackTheBox (ongoing). Writing CTF write-ups.

**Practical Output:** Participate in at least 2 CTF competitions (use CTFtime.org to find upcoming events, or picoCTF for anytime practice). Solve at least 10 challenges across different categories. Write a detailed write-up for each solved challenge: the challenge description, your thought process, every step, the tools used, and the flag. Publish write-ups on a personal blog or GitHub (public is fine for CTF write-ups — this is the convention in the CTF community).

**Skills Unlocked:**
- CTF (`practice`) — `intermediate`

**Resources:**
- [VIDEO] How to Start CTF — John Hammond — https://www.youtube.com/watch?v=Lus7aNf2xDg
- [ARTICLE] CTFtime — https://ctftime.org/
- [INTERNAL_TEXT] CTF write-ups are the cybersecurity equivalent of a data science notebook — they show your thinking process, not just your result. A write-up that says "I ran SQLMap and got the flag" is worthless. A write-up that explains why you suspected SQL injection, how you tested it manually first, why the automated tool then worked, and what the vulnerability in the underlying code was — that write-up demonstrates real understanding. John Hammond's YouTube channel is built almost entirely on CTF write-ups done live — watching his process teaches you how to think through an unknown challenge.

---

### Topic 8.2 — Bug Bounty Hunting: Getting Started
**Type:** Lesson + Practice
**Estimated Time:** 4–5 hrs
**Difficulty:** Advanced

**Description:** How bug bounty programs work: in-scope vs out-of-scope, responsible disclosure, reward tiers. Top platforms: HackerOne, Bugcrowd, Intigriti. Choosing a program. Recon for bug bounty: subdomain enumeration (Subfinder, Amass), OSINT techniques, identifying attack surface. What gets rewarded vs what gets duplicated or won't-fixed.

**Practical Output:** Set up accounts on HackerOne and Bugcrowd. Choose a beginner-friendly program with a broad scope. Perform reconnaissance on their in-scope assets: subdomain enumeration, technology fingerprinting, port scanning (only in-scope assets). Document your recon findings. Do **not** submit findings until you've found a genuine, verifiable vulnerability — submitting noise wastes your reputation and the triage team's time.

**Skills Unlocked:**
- Bug Bounty (`practice`) — `beginner`
- Network Reconnaissance (`practice`) — `advanced`

**Resources:**
- [VIDEO] Bug Bounty Hunting for Beginners — TCM Security — https://www.youtube.com/watch?v=lc7scxvKQOo
- [ARTICLE] HackerOne Getting Started — https://www.hackerone.com/hackers/get-started
- [INTERNAL_TEXT] Bug bounty is the most legitimate way to practice ethical hacking on real production systems. The program's policy is your written authorisation. Read it carefully before touching anything: it specifies what domains are in scope, what types of vulnerabilities qualify for rewards, and what's explicitly out of scope. A common mistake: testing systems not listed in scope and submitting a report. This can get you banned from the platform and, in extreme cases, result in legal action. Scope discipline is non-negotiable.

---

### Topic 8.3 — Reverse Engineering & Binary Exploitation Basics
**Type:** Lesson + Lab
**Estimated Time:** 5–6 hrs
**Difficulty:** Advanced

**Description:** Introduction to reverse engineering: what it is, when it's needed. Static analysis: strings, file type identification, disassembly with Ghidra (free). Dynamic analysis: running in a sandbox. Basic buffer overflow concept: stack layout, overwriting the return address. picoCTF and PWN challenges for practice.

**Practical Output:** picoCTF: complete the "Reverse Engineering" and "Binary Exploitation" beginner categories. Use Ghidra to decompile a simple crackme binary and find the password check logic without running it. Write a beginner's explanation of what a stack buffer overflow is and why it allows code execution.

**Skills Unlocked:**
- Reverse Engineering (`practice`) — `beginner`

**Resources:**
- [VIDEO] Ghidra Tutorial — John Hammond — https://www.youtube.com/watch?v=fTGTnrgjuGA
- [ARTICLE] Ghidra — NSA's reverse engineering tool — https://ghidra-sre.org/
- [INTERNAL_TEXT] Reverse engineering and binary exploitation are the deepest end of the security pool — they require understanding of assembly language, operating system internals, and memory management. You don't need to master them for most security roles, but a working understanding opens doors to malware analysis, vulnerability research, and exploit development careers. Ghidra (released by the NSA as free open-source software) is the industry-standard free reverse engineering tool — it decompiles machine code back into readable C-like pseudocode.

---

### Topic 8.4 — Cloud Security Fundamentals
**Type:** Lesson + Lab
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Cloud security shared responsibility model. AWS security basics: IAM policies, S3 bucket misconfigurations, EC2 security groups, CloudTrail logging. Common cloud misconfigurations: public S3 buckets, overly permissive IAM roles, exposed metadata endpoints. AWS free tier for practice. Cloud pentesting tools: Pacu, Scout Suite.

**Practical Output:** Set up an AWS free tier account. Configure an intentionally misconfigured S3 bucket (public access), find it with Scout Suite, and then fix it. Test the AWS instance metadata endpoint (SSRF-to-metadata attack concept). Write a "cloud security checklist" of the 10 most common misconfigurations and how to audit for each. **Only test against resources you own in your own AWS account.**

**Skills Unlocked:**
- Cloud Security (`practice`) — `beginner`

**Resources:**
- [VIDEO] AWS Security Tutorial — NetworkChuck — https://www.youtube.com/watch?v=gLe9i3HaS4g
- [ARTICLE] AWS Security Best Practices — aws.amazon.com — https://aws.amazon.com/security/security-resources/
- [INTERNAL_TEXT] Cloud security is the fastest-growing specialisation in cybersecurity. Almost every company has moved infrastructure to AWS, Azure, or GCP — and many have done so without fully understanding the shared responsibility model. The cloud provider secures the infrastructure; you are responsible for securing everything on top of it. S3 buckets containing sensitive data have been left publicly accessible at companies including Capital One, Twitch, and Toyota. The fix is one AWS policy change — the miss is a cultural and process failure, not a technical impossibility.

---

### Topic 8.5 — PROJECT: Public CTF Write-Up + Bug Bounty Report
**Type:** Project (Milestone — Capstone)
**Difficulty:** Advanced
**Estimated Time:** Ongoing (20–30 hrs over the stage)

**Description:** This is the graduation capstone — two deliverables that serve as your public cybersecurity portfolio.

**Deliverable 1: CTF Write-Up Collection (public)**
- At minimum 5 fully solved CTF challenge write-ups, published publicly on a personal blog (GitHub Pages, Hashnode, or Medium) or in a public GitHub repo
- Challenges must span at least 3 categories (e.g. web, forensics, crypto)
- Each write-up: challenge description, methodology, tools used, solution, and what you learned
- Write-ups must be original and detailed — not just "run tool X, get flag"

**Deliverable 2: Bug Bounty Report (if a real vulnerability was found — private submission to program)**
- If you found a real vulnerability in your bug bounty recon: submit a professional report to the program
- Report format: title, severity, CVSS score, description, reproduction steps, impact, remediation
- Screenshot evidence at each step
- If no real vulnerability was found: write a mock report for a vulnerability you found in a lab environment (clearly labelled as lab/practice report)

**Combined Portfolio:**
- A personal security portfolio page (GitHub Pages or similar): lists your TryHackMe profile (with badge/room completion stats), Hack The Box profile, CTF write-ups, lab report samples (redacted/sanitised), and any bug bounty hall-of-fame mentions

**Skills Demonstrated:** All path skills at their maximum level.

**Resources:**
- [ARTICLE] How to write a bug bounty report — HackerOne — https://www.hackerone.com/vulnerability-and-security-testing/hacker101-learn-how-to-write-a-great-vulnerability-report
- [INTERNAL_TEXT] Your public portfolio in cybersecurity is different from other paths. You don't put pentest reports of real clients online. You put CTF write-ups (universally accepted in the community), TryHackMe and HackTheBox profile links (which show your room completion and ranking), and any hall-of-fame acknowledgements from bug bounty programs. Employers specifically look at TryHackMe top-x% rankings, HackTheBox "Pro Hacker" tier or above, and the quality of your write-ups. A blog with 10 detailed, well-written CTF write-ups outweighs a resume that just says "I know Burp Suite."

---

## Full Skills Catalog for This Path

| Skill | Category | Max Level |
|-------|----------|-----------|
| Networking | `fundamentals` | `intermediate` |
| HTTP basics | `fundamentals` | `intermediate` |
| Linux | `platform_service` | `advanced` |
| Windows | `platform_service` | `intermediate` |
| Kali Linux | `platform_service` | `intermediate` |
| Python | `language` | `intermediate` |
| Bash | `language` | `intermediate` |
| Nmap | `tool` | `intermediate` |
| Wireshark | `tool` | `intermediate` |
| Burp Suite | `tool` | `intermediate` |
| Metasploit | `tool` | `intermediate` |
| Network Tools | `tool` | `beginner` |
| SIEM | `tool` | `beginner` |
| Virtualisation | `tool` | `beginner` |
| Security Fundamentals | `practice` | `advanced` |
| Ethical Hacking Methodology | `practice` | `advanced` |
| Scripting | `practice` | `intermediate` |
| Network Reconnaissance | `practice` | `advanced` |
| Enumeration | `practice` | `intermediate` |
| Vulnerability Assessment | `practice` | `intermediate` |
| Web Application Testing | `practice` | `advanced` |
| SQL Injection | `practice` | `intermediate` |
| XSS | `practice` | `intermediate` |
| Web Exploitation | `practice` | `intermediate` |
| API Security Testing | `practice` | `beginner` |
| System Exploitation | `practice` | `advanced` |
| Privilege Escalation | `practice` | `intermediate` |
| Post-Exploitation | `practice` | `beginner` |
| Active Directory | `practice` | `beginner` |
| Cryptography | `practice` | `intermediate` |
| Password Attacks | `practice` | `beginner` |
| Wireless Security | `practice` | `beginner` |
| Blue Team | `practice` | `advanced` |
| Incident Response | `practice` | `beginner` |
| Network Defence | `practice` | `beginner` |
| Threat Intelligence | `practice` | `beginner` |
| Bug Bounty | `practice` | `beginner` |
| CTF | `practice` | `intermediate` |
| Cloud Security | `practice` | `beginner` |
| Reverse Engineering | `practice` | `beginner` |

**Total: 40 skills**

---

## Certificate Suggestions

### Stage 1 Certificate Suggestion
*(After: Home Lab Setup project)*

**Certificate:** Cisco Introduction to Cybersecurity
**Provider:** Cisco Networking Academy
**URL:** https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity
**Cost:** `free`
**cost_note:** Completely free, digital badge on Cisco Networking Academy, shareable to LinkedIn
**Trigger:** `on_stage_complete`
**Why now:** After completing your home lab setup and TryHackMe Pre-Security foundations, the Cisco Intro to Cybersecurity course validates your conceptual foundation. It's globally recognised, widely listed on entry-level job postings as a signal of seriousness, and takes about 15 hours. The digital badge carries Cisco's brand — one of the most respected names in networking.

---

### Stage 3 Certificate Suggestion
*(After: Security Audit Report project)*

**Certificate:** ISC2 Certified in Cybersecurity (CC)
**Provider:** ISC2
**URL:** https://www.isc2.org/landing/1mcc
**Cost:** `free`
**cost_note:** Free training AND free exam under ISC2's 1 Million Certified programme. Annual maintenance fees (~$50/yr) apply after certification. This offer may not last indefinitely — check current availability.
**Trigger:** `on_stage_complete`
**Why now:** The ISC2 CC is a vendor-neutral entry-level certification from one of the most respected cybersecurity bodies in the world. It covers security principles, network security, access controls, incident response, and cryptography — everything you've studied in Stages 1–3. The free training + free exam under the 1 Million Certified programme makes this an extraordinary value. It's the strongest entry-level credential to have on a resume before attempting CompTIA Security+.

---

### Stage 5 Certificate Suggestion
*(After: Web Pentest Report project)*

**Certificate:** PortSwigger Web Security Academy — All Labs Completion
**Provider:** PortSwigger (Burp Suite creators)
**URL:** https://portswigger.net/web-security
**Cost:** `free`
**cost_note:** Free — no certificate issued, but completion of all labs is verifiable via your PortSwigger profile and widely respected as a portfolio signal
**Trigger:** `on_stage_complete`
**Why now:** PortSwigger Web Security Academy is the gold standard for web application security training — made by the creators of Burp Suite. Completing all labs (or a significant portion) is a stronger signal to web security employers than any certificate, because the labs require actual exploitation skill, not just knowledge of concepts. Link your PortSwigger profile in your portfolio alongside your pentest report.

---

### Stage 6 Certificate Suggestion
*(After: Full Pentest Simulation project)*

**Certificate:** TryHackMe — Top 1% / Top 5% Ranking
**Provider:** TryHackMe
**URL:** https://tryhackme.com/
**Cost:** `free`
**cost_note:** Free — ranking is achieved through completing rooms. Premium subscription (~$10–14/mo) unlocks more rooms faster but is optional. The ranking badge is shareable on LinkedIn.
**Trigger:** `on_stage_complete`
**Why now:** A TryHackMe top 1–5% ranking is one of the most credible signals of practical cybersecurity skill that an entry-level candidate can display. Employers and hiring managers specifically mention it in job postings and on Reddit hiring threads. By Stage 6 you will have completed enough rooms to be in the top 5%. Put the ranking badge on your LinkedIn and in your resume header.

---

### Stage 8 Certificate Suggestion
*(After: CTF Write-Up + Bug Bounty Capstone)*

**Certificate:** Google Cybersecurity Professional Certificate
**Provider:** Google / Coursera
**URL:** https://www.coursera.org/professional-certificates/google-cybersecurity
**Cost:** `free_audit`
**cost_note:** Free to audit all content. ~$49/month for the graded certificate. Financial aid available. Certificate prepares you for and includes a 33% discount on the CompTIA Security+ exam (normally ~$392).
**Trigger:** `on_stage_complete`
**Why now:** After completing the full path, you're technically beyond most of the Google Cybersecurity Certificate's content — but the Google brand and the CompTIA Security+ prep make it worth completing. The dual credential (Google cert + CompTIA Security+ discount) is the most cost-effective path to the most employer-recognised entry-level security certification. CompTIA Security+ is listed as a requirement or preference on more entry-level security job postings than any other certification. The combination of your practical portfolio (TryHackMe ranking, CTF write-ups, pentest reports) plus Security+ creates a very strong candidacy.

---

## Certificate Summary Table

| After Stage | Certificate | Provider | Cost | Notes |
|---|---|---|---|---|
| Stage 1 | Introduction to Cybersecurity | Cisco | Free | Digital badge, LinkedIn-addable |
| Stage 3 | Certified in Cybersecurity (CC) | ISC2 | Free (limited programme) | Vendor-neutral, globally recognised |
| Stage 5 | Web Security Academy Labs | PortSwigger | Free | Portfolio signal, not a formal cert |
| Stage 6 | Top 1–5% Ranking | TryHackMe | Free | Badge shareable, highly employer-recognised |
| Stage 8 | Google Cybersecurity Certificate | Google/Coursera | Free audit / ~$49/mo cert | Includes CompTIA Security+ discount |

---

## Opportunity Analyzer Tags

Skills that map directly to cybersecurity / ethical hacking job postings (based on LinkedIn/Indeed analysis, 2025–2026):

**High demand (>70% of cybersecurity postings):**
Linux, Networking, Security Fundamentals, Python, Scripting, Web Application Testing, OWASP Top 10, Nmap, Burp Suite

**Medium demand (40–70%):**
Wireshark, Metasploit, SIEM, Incident Response, SQL Injection, XSS, Vulnerability Assessment, Cryptography, Active Directory, Blue Team

**Good to have (<40%):**
CTF, Bug Bounty, Cloud Security, Reverse Engineering, Wireless Security, Threat Intelligence, Post-Exploitation, API Security Testing

---

## Progression Rules

- Stages 1–4 are sequential and mandatory — no skipping.
- Learners with a strong networking/Linux background can self-assess to begin at Stage 3.
- Each stage requires the milestone project/lab to be submitted before the next stage unlocks.
- Topics within a stage can be completed in any order.
- The Lab Work milestone type does not produce a public Portfolio Hub item — it goes to a **private** write-up. Only CTF write-ups and anonymised/sanitised report samples are made public.
- The Capstone (Stage 8, Topic 8.5) is the path's graduation project — completing it unlocks a "Cybersecurity Graduate" badge on the learner's profile.

---

## Special Platform Integration Notes

**TryHackMe:** Learners should connect their TryHackMe account to their Mallah profile. Progress in specified rooms is tracked and counts toward topic completion. The TryHackMe ranking badge is automatically surfaced on the Portfolio Hub.

**Hack The Box:** Same integration. "Pro Hacker" tier and above is surfaced as a skill badge.

**PortSwigger Web Security Academy:** Learners link their profile manually. Lab completion percentage is displayed on their portfolio.

**CTF Write-Ups:** Public write-up links can be added manually to the Portfolio Hub. They display as "Research & Write-ups" on the learner's public profile.

> ⚠️ **Permanent Legal Reminder (displayed in every topic):** All techniques in this path are practised only in authorised environments. Unauthorised access to computer systems is a criminal offence in every jurisdiction. Always get written permission before testing any system you don't personally own. When in doubt — don't.
