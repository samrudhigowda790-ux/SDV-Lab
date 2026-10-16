# Discrete Probability Distributions – AIML Laboratory

## 🌐 Live Website

**Website Link:** https://samrudhigowda790-ux.github.io/SDV-Lab/

**GitHub Repository:** https://github.com/samrudhigowda790-ux/SDV-Lab

## 📌 About the Project

This project is a website developed as part of my AIML laboratory work to understand Discrete Probability Distributions. It helps me learn probability calculations, statistical measures, and graphical representation of different distributions in an interactive way.

The website contains three modules:

1. Binomial Distribution
2. Poisson Distribution
3. Geometric Distribution

Users can enter their own values, calculate probabilities and statistical measures, and observe how the probability distribution changes through graphs.

## 📁 Files and Their Purpose

| File | Purpose |
|---|---|
| `index.html` | Home page with links to all three distribution modules. |
| `binomial.html` | Calculates Binomial Distribution probabilities and statistics and displays a PMF graph. |
| `poisson.html` | Calculates Poisson Distribution probabilities and statistics and displays probability graphs. |
| `geometric.html` | Calculates Geometric Distribution probabilities and statistics and displays a PMF graph. |
| `style.css` | Provides common styling and layout for the website. |

## 1. Binomial Distribution

**File:** `binomial.html`

The Binomial Distribution is used to calculate the probability of getting a particular number of successes in a fixed number of independent trials, where each trial has the same probability of success.

### Inputs

- **n:** Total number of trials. It must be a positive integer.
- **p:** Probability of success in each trial, between 0 and 1.
- **k:** Number of successes for which the probability is calculated. It must satisfy \(0 \leq k \leq n\).

Default values are \(n=20\) and \(p=0.35\).

### Formulas

- Mean: \(E(X)=np\)
- Variance: \(\operatorname{Var}(X)=np(1-p)\)
- Standard deviation: \(\sigma=\sqrt{np(1-p)}\)
- Second moment: \(E(X^2)=\operatorname{Var}(X)+[E(X)]^2\)
- Skewness: \(\dfrac{1-2p}{\sqrt{np(1-p)}}\)

**Probability Mass Function (PMF):**

\[
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}
\]

**Cumulative Distribution Function (CDF):**

\[
P(X\leq k)=\sum_{x=0}^{k}P(X=x)
\]

The page also calculates \(P(X>k)=1-P(X\leq k)\).

### Graph

The PMF bar chart shows the probability of each possible number of successes. It includes a dashed line for the mean and tooltips to view probability values.

### How to use it

1. Open the Binomial module from the home page.
2. Enter the total number of trials \(n\) and probability of success \(p\).
3. View the mean, variance, standard deviation, second moment, and skewness.
4. Enter a valid value of \(k\) to calculate the PMF and CDF.
5. Observe the graph and see how changing \(n\) or \(p\) affects the distribution.

## 2. Poisson Distribution

**File:** `poisson.html`

The Poisson Distribution calculates the probability of a certain number of events occurring in a fixed interval when events occur independently at a constant average rate.

### Inputs

- **\(\lambda\) (lambda):** Average number of events in the interval. It must be positive.
- **k:** Number of events for which the probability is calculated. It must be a non-negative integer.

The page provides an input for lambda and an input for \(k\).

### Formulas

- Mean: \(E(X)=\lambda\)
- Variance: \(\operatorname{Var}(X)=\lambda\)
- Standard deviation: \(\sigma=\sqrt{\lambda}\)

**Probability Mass Function (PMF):**

\[
P(X=k)=\frac{e^{-\lambda}\lambda^k}{k!}
\]

**Cumulative Distribution Function (CDF):**

\[
P(X\leq k)=\sum_{x=0}^{k}
\frac{e^{-\lambda}\lambda^x}{x!}
\]

### Graphs

The page displays a PMF bar chart for the selected lambda and a comparison graph for different lambda values. These graphs help demonstrate how the distribution changes as the average event rate changes.

### How to use it

1. Open the Poisson module.
2. Enter a positive value of lambda.
3. View the mean, variance, and standard deviation.
4. Enter a non-negative integer \(k\).
5. View the probability of exactly \(k\) events and the cumulative probability up to \(k\).
6. Compare the graphs for different lambda values.

## 3. Geometric Distribution

**File:** `geometric.html`

The Geometric Distribution calculates the probability that the first success occurs on a particular trial in a sequence of independent trials, each having the same probability of success.

This website uses the convention that \(X\) represents the **trial number of the first success**, so \(X=1,2,3,\ldots\).

### Inputs

- **p:** Probability of success on each trial, between 0 and 1.
- **k:** Trial number on which the first success occurs. It must be a positive integer.

The default probability of success is \(p=0.35\).

### Formulas

- Mean: \(E(X)=\dfrac{1}{p}\)
- Variance: \(\operatorname{Var}(X)=\dfrac{1-p}{p^2}\)
- Standard deviation: \(\sigma=\dfrac{\sqrt{1-p}}{p}\)

**Probability Mass Function (PMF):**

\[
P(X=k)=(1-p)^{k-1}p
\]

**Cumulative Distribution Function (CDF):**

\[
P(X\leq k)=1-(1-p)^k
\]

### Graph

The PMF graph displays the probability that the first success occurs on each trial. It helps visualize how the probability changes with the trial number and success probability.

### How to use it

1. Open the Geometric module.
2. Enter the probability of success \(p\).
3. View the mean, variance, and standard deviation.
4. Enter a positive integer \(k\).
5. Calculate the PMF and CDF.
6. Observe the graph and experiment with different values of \(p\).

## 🧪 Learning Outcomes

Through this project, I learned:

- The basic concepts and differences between Binomial, Poisson, and Geometric Distributions.
- How to calculate probability using PMF and CDF formulas.
- How to calculate and interpret mean, variance, and standard deviation.
- How input values affect probability distributions.
- How to validate user inputs before performing calculations.
- How to create interactive web pages using HTML.
- How to style web pages using CSS.
- How to use JavaScript for calculations and interactive functionality.
- How to display probability distributions using charts.
- How to connect multiple pages through navigation links.
- How to organize project files and publish a website using GitHub and GitHub Pages.

## 🛠️ Technologies Used

- **HTML:** Structure and content of the website.
- **CSS:** Styling, layout, and presentation.
- **JavaScript:** Probability calculations, input validation, and dynamic updates.
- **Chart.js:** Interactive probability charts, where included in the pages.
- **GitHub:** Version control and storage of project files.
- **GitHub Pages:** Hosting the live website.

## ▶️ How to Run the Project Locally

1. Download or clone the `SDV-Lab` repository.
2. Open the `html website` folder.
3. Open `index.html` in a web browser.
4. Select Binomial, Poisson, or Geometric Distribution from the navigation menu.
5. Enter the required values and explore the calculations and graphs.

An internet connection may be required for chart libraries loaded from an external CDN.

## 📚 Conclusion

This project helped me connect theoretical probability concepts with practical calculations and visualizations. By building the three distribution modules, I gained experience in statistics, data visualization, HTML, CSS, JavaScript, and publishing a working educational website.

The website serves as an interactive learning tool for understanding discrete probability distributions and observing their behavior with different input values.
