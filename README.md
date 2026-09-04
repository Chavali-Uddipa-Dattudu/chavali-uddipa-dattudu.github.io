# Chavali Uddipa Dattudu — Personal Portfolio

A responsive personal portfolio website focused on **VLSI, RF CMOS IC Design, Analog VLSI, EDA Automation, and PCB Design**.

🌐 **Live Website:** https://chavali-uddipa-dattudu.github.io/

## Overview

This repository contains the source files for my personal engineering portfolio.

The portfolio presents:

- Academic background and technical interests
- Research experience at **NIT Calicut**
- Engineering projects with schematics, simulation results, and measurable outcomes
- Technical skills and tools
- Achievements and competition results
- Internship completion certificate
- Resume and professional contact links

The site uses a clean engineering-oriented visual style with both **Light** and **Dark** themes.

## Technical Focus

### VLSI / IC Design
- Analog VLSI
- RF CMOS / RFIC Design
- 180nm CMOS circuit design
- SRAM characterization
- Transistor-level simulation

### EDA & Automation
- Cadence Virtuoso
- NGSPICE
- Python
- Pandas
- Matplotlib
- Simulation automation and result extraction

### Hardware
- PCB Design
- KiCad
- Embedded / IoT-oriented hardware development

## Featured Projects

### 9 GHz CMOS Low Noise Amplifier
An X-band RF CMOS LNA designed in a 180nm process using Cadence Virtuoso.

Key results presented on the portfolio:

- 11.06 dB S21 gain
- 1.41 dB noise figure
- -17.06 dB S11
- -23.27 dB S22
- 14.13 mW DC power

Repository:  
https://github.com/Chavali-Uddipa-Dattudu/9GHz-LNA-180nm-CMOS

### 180nm 6T SRAM Cell Design
A transistor-level six-transistor SRAM design and characterization project.

Featured analysis includes:

- Read static noise margin
- Voltage-transfer characteristics
- Transient behavior
- Timing analysis
- Dynamic power characterization

Repository:  
https://github.com/Chavali-Uddipa-Dattudu/180nm-6T-SRAM-Design

### Automated CMOS Inverter Characterization
A Python + NGSPICE automation workflow for generating simulations, performing width sweeps, extracting results, and visualizing CMOS inverter characteristics.

Repository:  
https://github.com/Chavali-Uddipa-Dattudu/CMOS-Inverter-Automation

### LiPo Battery Charger PCB
A hardware design project covering schematic capture, PCB layout, and 3D board visualization.

Repository:  
https://github.com/Chavali-Uddipa-Dattudu/LiPo-Battery-Charger-PCB

## Research Experience

### National Institute of Technology Calicut
**Research Internship — Analog IC Design for CMOS Image Sensors**

Focus areas include:

- Programmable Gain Amplifiers (PGAs)
- Single-Slope ADCs
- Transistor-level circuit modeling
- Simulation and characterization

### National Institute of Technology Calicut
**Summer Research Internship — RFIC Design for Anti-Drone Radar**

Focus areas include:

- 9 GHz cascode LNA design
- 180nm CMOS
- Active LC matching
- S-parameter analysis
- Noise figure
- Stability and DC characterization

## Website Features

- Responsive desktop, tablet, and mobile layouts
- Light / Dark theme switcher with saved preference
- Typewriter-style name animation
- Engineering-style experience timeline
- Project domain filters
- Technical project proof sections
- Achievement evidence cards
- Certificate preview lightbox
- Certificate download option
- Image lightbox for engineering figures
- Keyboard-accessible navigation
- Reduced-motion support
- SEO metadata and canonical URL
- Open Graph / social sharing metadata
- Keyboard command palette (`Ctrl + K` / `Cmd + K`)

## Repository Structure

```text
.
├── index.html
├── style.css
├── resume.pdf
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── images/
    ├── achievements/
    ├── certificates/
    ├── cmos-inverter/
    ├── logos/
    ├── lna/
    ├── pcb/
    ├── profile/
    └── sram/
```

## Running Locally

This is a static HTML/CSS/JavaScript website, so no build system is required.

### Open directly

Open `index.html` in a modern browser.

### Or use a local server

From the repository directory:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Using a local server is recommended when testing assets, navigation, and browser behavior.

## GitHub Pages Deployment

The website is deployed as a GitHub Pages user site from the `main` branch.

Repository:

```text
chavali-uddipa-dattudu.github.io
```

Publishing source:

```text
Branch: main
Folder: /
```

Live site:

```text
https://chavali-uddipa-dattudu.github.io/
```

## Updating the Website

The portfolio is designed to be continuously updated.

Typical workflow:

```text
Edit files
   ↓
Commit changes
   ↓
Push to main
   ↓
GitHub Pages redeploys
   ↓
Live website updates
```

For image updates, preserve the folder structure used by `index.html`.

## Image Guidelines

Website images should preferably use optimized web-friendly formats such as:

- WebP for photographs and most graphics
- JPG where appropriate
- PNG where transparency or lossless graphics are needed

Avoid unnecessarily large source images in the deployed site.

Engineering plots and schematics should retain their original visual meaning and should not be color-inverted in dark mode.

## Contact

**Portfolio:**  
https://chavali-uddipa-dattudu.github.io/

**GitHub:**  
https://github.com/Chavali-Uddipa-Dattudu

**LinkedIn:**  
https://linkedin.com/in/chavaliuddipadattudu

**Email:**  
chavaliuddipadattudu@gmail.com

**WhatsApp:**  
+91 9392741655

## Resume

The latest resume is available from the portfolio website and is stored as:

```text
resume.pdf
```

## License

This repository is a personal portfolio project.

The website source code may be used as a reference, but personal photographs, certificates, resume content, achievement evidence, and other personal assets are not intended for redistribution.

---

