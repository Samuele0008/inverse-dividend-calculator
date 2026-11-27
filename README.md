# DCSimulator

DCSimulator is a free web simulator that calculates the capital required to reach a target dividend income.

Unlike traditional calculators, the model starts from the desired monthly income and determines the required capital while accounting for taxes, fund fees, inflation, and dividend growth.

**Website:** https://dcsimulator.me/

## Features

- Inverse calculation: from monthly income to required capital
- Support for EUR, USD, GBP, CHF, and CAD
- Configurable parameters for:
  - Gross dividend yield
  - Annual dividend growth
  - Growth volatility
  - Tax rate
  - Inflation
  - Expense ratio
  - Monthly savings
  - Investment horizon
- Monte Carlo simulation with 1,000–25,000 scenarios
- Results organized into percentiles from P10 to P90
- Comparison between projected capital and accumulated savings over time
- Graphical distribution of results
- Export and print support
- Dedicated pages for methodology, blog, and project information

## Core Formula

The required capital is estimated as:

```text
Required Capital = Annual Target Income / Net Yield
```

Where:

```text
Net Yield = Gross Yield × (1 - Tax Rate) - Expense Ratio
```

In the simulation, the target income is adjusted upward annually for inflation, while yield evolves based on the configured average growth and volatility.

## Repository Structure

```text
Main/
├── index.html        # Calculator and Monte Carlo engine
├── methodology.html  # Methodology explanation
├── about.html        # Project information
├── blog.html         # Article index
├── blog/             # Blog articles
├── css/              # Stylesheets
├── js/               # JavaScript modules
├── tecnical/         # Privacy and cookie policies
├── llms.txt          # Text index of pages
├── sitemap.xml       # SEO sitemap
├── robots.txt        # Instructions for crawlers
└── CNAME             # Custom domain
```

## Local Development

The site does not require packages, builds, or system dependencies. The interface is built with static HTML, CSS, and JavaScript.

```bash
cd Main
python3 -m http.server 8000
```

Then open http://localhost:8000/

Alternatively, you can open `Main/index.html` directly in a browser.

## Deploy

The custom domain is configured in `Main/CNAME`. GitHub Pages must be enabled for the repository before the site can be deployed. GitHub Pages branch-based publishing supports the repository root or `/docs`; to publish from `Main/`, configure a GitHub Actions workflow or move the site to a supported publishing directory.

To publish a change:

1. Modify the files in the `Main/` directory.
2. Push the changes to the branch configured for GitHub Pages.
3. Wait for deployment to complete.

## Data and Results

DCSimulator is an educational planning tool and does not provide financial advice.

The results depend on the assumptions entered by the user and do not guarantee future returns. Actual taxes, future dividends, costs, and inflation may differ from the estimates used.

The Monte Carlo simulation generates many hypothetical paths and does not represent a certain prediction of market behavior.

## Contact

- Email: samuele.cryp@gmail.com
- Website: https://dcsimulator.me/
- Repository: https://github.com/Samuele0008/inverse-dividend-calculator
