# Mallah — Data Science & Machine Learning Path
## Full Roadmap Specification (with Resources & Certificates)

**Path ID:** `datascience`
**Estimated Duration:** 7–10 months (at 1–2 hrs/day)
**Difficulty:** Beginner → Advanced
**Philosophy:** Data science is learned by doing — not by watching lectures. Every topic produces something real: a cleaned dataset, a working model, a chart that answers a question, a deployed prediction tool. By the end, the learner has a portfolio of end-to-end projects and the instincts to attack a new data problem from scratch.

**Stack:** Python · NumPy · Pandas · Matplotlib · Seaborn · Plotly · SQL · Scikit-learn · XGBoost · Statsmodels · Jupyter · Kaggle · Streamlit · MLflow

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

| Stage | Title | Topics | Project |
|-------|-------|---------|---------|
| 1 | Python for Data Science | 7 | Data Exploration Script |
| 2 | Data Wrangling & SQL | 6 | Messy Data → Clean Insights |
| 3 | Exploratory Data Analysis & Visualisation | 6 | EDA Report |
| 4 | Statistics & Probability Foundations | 6 | Statistical Analysis Report |
| 5 | Machine Learning Fundamentals | 7 | Predictive Model |
| 6 | Advanced ML & Ensembles | 6 | Kaggle Competition Entry |
| 7 | Deep Learning & NLP Basics | 6 | Text Classifier |
| 8 | MLOps, Deployment & Capstone | 5 | Deployed ML App |

**Total:** 49 topics · 8 projects · 28 skills unlocked

---

## Stage 1 — Python for Data Science
**Tagline:** Learn the language of data — but differently from web developers. Data scientists use Python differently.
**Duration:** ~3 weeks
**Note:** This stage covers Python fundamentals with a data science lens. Learners who already know Python basics can skip to Stage 2 after a self-assessment quiz.

---

### Topic 1.1 — Python Basics & the Data Science Environment
**Type:** Lesson + Setup
**Estimated Time:** 2 hrs
**Difficulty:** Beginner

**Description:** What data science is and isn't. Set up the data science environment: Anaconda or Python + pip, Jupyter Notebooks (local) and Kaggle Notebooks (cloud, free GPU). Variables, data types, control flow, functions. Python's interactive execution model — why Jupyter is perfect for data work.

**Practical Output:** Set up a Jupyter Notebook. Write a Python script that reads a CSV from a URL (using `requests`), prints the first 5 rows manually, counts the number of lines, and displays basic summary info — all in pure Python (no libraries yet).

**Skills Unlocked:**
- Python (`language`) — `beginner`
- Jupyter (`tool`) — `beginner`

**Resources:**
- [VIDEO] Python for Beginners — freeCodeCamp — https://www.youtube.com/watch?v=rfscVS0vtbw
- [ARTICLE] Jupyter Notebook Tutorial — DataCamp — https://www.datacamp.com/tutorial/tutorial-jupyter-notebook
- [INTERNAL_TEXT] Data science Python is different from web developer Python. You'll spend less time on classes and design patterns, and more time on list comprehensions, lambda functions, and working with data structures that mirror tables. Jupyter Notebooks are the default environment because they let you run one cell at a time, see output immediately, and embed charts alongside code — perfect for exploratory work where you don't yet know what the data will reveal.

---

### Topic 1.2 — NumPy: The Foundation of Numerical Python
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Beginner

**Description:** Why NumPy? Arrays vs Python lists (speed, vectorisation). Creating arrays, indexing, slicing, reshaping. Mathematical operations: element-wise, broadcasting. `np.mean`, `np.std`, `np.sum`, `np.where`. Linear algebra basics.

**Practical Output:** Load a dataset of 10,000 random temperature readings (generate with NumPy). Compute mean, median, std deviation, min, max. Find all readings above 35°C. Compute a "normalised" version of the dataset using vectorised operations — no loops.

**Skills Unlocked:**
- Python (`language`) — `beginner`
- NumPy (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] NumPy Crash Course — freeCodeCamp — https://www.youtube.com/watch?v=QUT1VHiLmmI
- [ARTICLE] NumPy Quickstart — numpy.org — https://numpy.org/doc/stable/user/quickstart.html
- [INTERNAL_TEXT] NumPy is the engine beneath almost all data science in Python. Pandas DataFrames are built on NumPy arrays. Scikit-learn models take NumPy arrays as input. When you understand NumPy's vectorised operations — doing math on entire arrays without loops — you understand why Python can process millions of rows quickly. The key concept is broadcasting: applying an operation across arrays of different shapes without writing loops. Internalize it now and everything downstream becomes clearer.

---

### Topic 1.3 — Pandas Part 1: Loading, Inspecting & Selecting Data
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Beginner

**Description:** The DataFrame and Series — the core data structures. Loading data: CSV, Excel, JSON, from URLs. Inspecting: `.head()`, `.info()`, `.describe()`, `.shape`, `.dtypes`. Selecting: column selection, `.loc`, `.iloc`, boolean indexing, query strings.

**Practical Output:** Load the Titanic dataset (classic beginner dataset). Inspect its shape, types, and summary stats. Answer 5 specific questions using Pandas selectors: "How many passengers were female?", "What is the average age of survivors?", "List passengers over 60 in 1st class." etc.

**Skills Unlocked:**
- Pandas (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Pandas for Beginners — Corey Schafer — https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS
- [ARTICLE] Pandas Getting Started — pandas.pydata.org — https://pandas.pydata.org/docs/getting_started/intro_tutorials/
- [INTERNAL_TEXT] Pandas is to data science what SQL is to databases — it's the primary tool for selecting, slicing, and filtering tabular data. Most of your data science life will be spent in Pandas DataFrames. The crucial distinction: `.loc` selects by label (column name, index label), `.iloc` selects by integer position. Getting this wrong causes subtle bugs. Boolean indexing (`df[df['age'] > 30]`) is the most frequently used pattern in EDA — learn it until it's automatic.

---

### Topic 1.4 — Pandas Part 2: Transforming, Grouping & Aggregating
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** Adding and modifying columns. Applying functions: `.apply()`, `.map()`, vectorised string operations. Grouping with `.groupby()`. Aggregations: `sum`, `mean`, `count`, `agg`. Sorting. Handling missing values: `.isna()`, `.fillna()`, `.dropna()`.

**Practical Output:** Continue with the Titanic dataset. Add a derived column `AgeGroup` (child/adult/senior). Group by `Sex` and `AgeGroup`, compute survival rate per group. Find the 3 most common embarkation ports among survivors. Fill missing `Age` values with the median age per `Pclass`.

**Skills Unlocked:**
- Pandas (`framework_library`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] Pandas GroupBy — Corey Schafer — https://www.youtube.com/watch?v=txMdrV1Ut64
- [ARTICLE] Pandas groupby — pandas.pydata.org — https://pandas.pydata.org/docs/user_guide/groupby.html
- [INTERNAL_TEXT] `groupby` is the Pandas equivalent of SQL's `GROUP BY` — it splits a DataFrame into groups and applies an aggregation function to each. The pattern `df.groupby('column')['metric'].agg(['mean', 'count'])` covers 80% of real-world grouping tasks. Missing value handling is the most common first task on any real dataset — real data always has holes. Understanding *why* data is missing (random vs systematic) affects what you do with it. Imputing with median per subgroup (like `Pclass`) is smarter than imputing with the global median because it preserves group-level patterns.

---

### Topic 1.5 — Python for Data Science: Functions, Comprehensions & OOP Basics
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Beginner

**Description:** Writing reusable functions. Default arguments, `*args`, `**kwargs`. List comprehensions, dict comprehensions. Lambda functions. Basic OOP: classes and methods (enough to understand Scikit-learn's API pattern). Type hints for data science code.

**Practical Output:** Refactor your Titanic analysis into a set of reusable functions: `load_data(url)`, `clean_age(df)`, `compute_survival_rate(df, group_col)`, etc. Call them in sequence in a notebook. Add type hints.

**Skills Unlocked:**
- Python (`language`) — `intermediate`

**Resources:**
- [VIDEO] Python Functions & Comprehensions — Corey Schafer — https://www.youtube.com/watch?v=9Os0o3wzS_I
- [ARTICLE] Python Type Hints — mypy docs — https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html
- [INTERNAL_TEXT] Data science code that lives only in notebooks is hard to reuse and impossible to test. Wrapping your logic in functions lets you call the same cleaning process on multiple datasets, write unit tests, and share code across projects. The Scikit-learn API is built entirely on OOP — every model is a class with `.fit()` and `.predict()` methods. Understanding that pattern (even without deep OOP knowledge) makes Scikit-learn feel logical rather than magical.

---

### Topic 1.6 — Working with Files, APIs & Data Sources
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Beginner

**Description:** Reading from CSV, Excel, JSON, Parquet. Writing cleaned data back out. Fetching data from REST APIs with `requests`. Web scraping basics with `BeautifulSoup` (just enough to get data). Reading from Google Sheets (public). The data science data sourcing toolkit.

**Practical Output:** Fetch live weather data from Open-Meteo API (free, no key), parse the JSON, and save it as a clean CSV. Then load it back and print a summary: highest recorded temperature, city with most rain, average wind speed.

**Skills Unlocked:**
- Python (`language`) — `intermediate`
- REST API consumption (`practice`) — `beginner`

**Resources:**
- [VIDEO] Python Requests & APIs — Tech With Tim — https://www.youtube.com/watch?v=tb8gHvYlCFs
- [ARTICLE] Pandas read_csv docs — https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html
- [INTERNAL_TEXT] Real data science starts with data acquisition. In the real world, data doesn't arrive as a clean CSV waiting for you — you fetch it from APIs, scrape it from websites, query it from databases, or receive it as a messy Excel file with merged cells and hidden rows. Building fluency with data sourcing before modelling means you can work on real problems, not just tutorial datasets.

---

### Topic 1.7 — PROJECT: Data Exploration Script
**Type:** Project (Milestone)
**Difficulty:** Beginner
**Estimated Time:** 5–7 hrs

**Description:** Build a reusable Python data exploration script that can be pointed at any CSV or URL and automatically generates a summary report.

**Requirements:**
- Accept a URL or file path as input
- Load data with Pandas, detect column types automatically
- Generate a summary: shape, dtypes, missing value counts, numeric column stats (min, max, mean, median, std)
- Export a clean summary to a Markdown or HTML report
- All logic in importable functions (not just notebook cells)
- Push to GitHub with a README that includes a sample output

**Skills Demonstrated:**
- Python (`language`) — `intermediate`
- Pandas (`framework_library`) — `intermediate`
- NumPy (`framework_library`) — `beginner`
- Jupyter (`tool`) — `beginner`

**Resources:**
- [VIDEO] Building a Data Analysis Script — freeCodeCamp — https://www.youtube.com/watch?v=r-uOLxNrNk8
- [ARTICLE] Pandas profiling — ydata-profiling docs — https://docs.profiling.ydata.ai/latest/
- [INTERNAL_TEXT] The goal of this project isn't the output — it's the habit. Data scientists who write reproducible, reusable code from the start build better projects faster. Your exploration script should be something you actually use on every future project in this path. Add to it as you learn new techniques. By Stage 8, it should feel like your personal toolkit.

---

## Stage 2 — Data Wrangling & SQL
**Tagline:** Real data is always messy. Learn to clean it, reshape it, and query it like a professional.
**Duration:** ~2.5 weeks

---

### Topic 2.1 — Data Cleaning: Missing Values, Duplicates & Outliers
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Types of missing data: MCAR, MAR, MNAR. Strategies: drop, impute (mean/median/mode/forward-fill/KNN). Detecting duplicates and deciding what to drop. Outlier detection: IQR method, Z-score, visualisation. When to remove outliers vs keep them.

**Practical Output:** Take a deliberately broken dataset (the [Airbnb NYC dataset](https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data) — real-world messy). Identify all quality issues, document them, then apply appropriate fixes: impute missing prices, remove obvious price outliers (>$10,000/night), deduplicate listings. Before/after comparison.

**Skills Unlocked:**
- Data Wrangling (`practice`) — `beginner`
- Pandas (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Data Cleaning with Pandas — Keith Galli — https://www.youtube.com/watch?v=iYie42M1ZyU
- [ARTICLE] Handling missing data — pandas.pydata.org — https://pandas.pydata.org/docs/user_guide/missing_data.html
- [INTERNAL_TEXT] Data scientists spend 60–80% of project time cleaning data — not building models. The critical skill isn't knowing which function to call; it's developing the judgment to ask: why is this data missing? A column with 40% missing values in a medical dataset might be missing *because* the test wasn't done for healthy patients — and deleting those rows would introduce bias. Clean data first, model second. Always.

---

### Topic 2.2 — Data Reshaping & Merging
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Merging DataFrames: `merge`, `join` (inner, left, right, outer). Concatenating. Pivot tables and `pivot_table`. `melt` (wide to long). `stack` and `unstack`. Multi-level indexes. When to use each.

**Practical Output:** Merge two datasets: one containing Airbnb listing details and one containing neighbourhood crime statistics (NYC open data). Pivot to compute average listing price per neighbourhood × room_type. Melt back to long format for plotting later.

**Skills Unlocked:**
- Data Wrangling (`practice`) — `intermediate`
- Pandas (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Pandas Merge, Join & Concatenate — Corey Schafer — https://www.youtube.com/watch?v=h4hOPGo4UVU
- [ARTICLE] Pandas merging — pandas.pydata.org — https://pandas.pydata.org/docs/user_guide/merging.html
- [INTERNAL_TEXT] Merging datasets is one of the most powerful data wrangling operations — and one of the most error-prone. The most common mistake: not checking for duplicate keys before merging, which causes row explosion (a 100-row DataFrame merged with a 100-row DataFrame becomes 10,000 rows if keys aren't unique). Always check with `df.duplicated(subset=['key']).sum()` before a merge. Pivot tables are SQL's `GROUP BY` with a visual pivot — once you internalise them, a whole category of "how many X per Y?" questions become one-liners.

---

### Topic 2.3 — Time Series Data with Pandas
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** DateTime index. Parsing dates with `pd.to_datetime`. Resampling: daily to monthly, hourly to weekly. Rolling averages. Shifting and differencing. Time zone handling. Plotting time series.

**Practical Output:** Load a publicly available COVID-19 time series (Our World in Data). Resample to weekly averages. Compute a 7-day rolling average of new cases. Calculate week-over-week percentage change. Plot three countries' trends on one chart.

**Skills Unlocked:**
- Data Wrangling (`practice`) — `intermediate`
- Pandas (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Time Series Analysis with Pandas — freeCodeCamp — https://www.youtube.com/watch?v=e8Yw4alG16Q
- [ARTICLE] Pandas time series — pandas.pydata.org — https://pandas.pydata.org/docs/user_guide/timeseries.html
- [INTERNAL_TEXT] Time series data is everywhere: stock prices, website traffic, sensor readings, sales figures. The critical concept is resampling — aggregating fine-grained data (hourly readings) into coarser units (daily averages) without losing temporal ordering. Rolling averages are the most used smoothing technique — they reduce noise so you can see underlying trends. In job interviews, time series questions are extremely common. Start thinking in these temporal patterns early.

---

### Topic 2.4 — SQL for Data Scientists
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** SQL basics to advanced queries: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. Joins: INNER, LEFT, RIGHT. Subqueries. CTEs (WITH clauses). Window functions: ROW_NUMBER, RANK, LAG, LEAD, SUM OVER PARTITION. NULL handling. SQLite in Python with `sqlite3` and Pandas.

**Practical Output:** Load the Airbnb NYC dataset into a SQLite database. Write 8 queries that answer real questions: top 10 most expensive neighbourhoods, host with most listings, running total of reviews per month, rank hosts by average price within each neighbourhood group.

**Skills Unlocked:**
- SQL (`language`) — `intermediate`

**Resources:**
- [VIDEO] SQL for Data Analysis — freeCodeCamp — https://www.youtube.com/watch?v=HXV3zeQKqGY
- [ARTICLE] SQLite Python Tutorial — sqlite.org — https://www.sqlite.org/lang.html
- [INTERNAL_TEXT] SQL is the most commonly tested skill in data science interviews — not Python, not machine learning. Every data scientist needs to query databases to get the data they'll later analyse. Window functions (ROW_NUMBER, RANK, LAG) are what separate intermediate from advanced SQL users — they let you compute running totals, rank within groups, and compare rows to previous/next rows without self-joins. Learn them now; they appear in almost every SQL interview.

---

### Topic 2.5 — Advanced Pandas: Performance & Best Practices
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Pandas performance: vectorised operations vs `.apply()` (and when to use each). `pd.Categorical` for memory savings. Chaining with `.pipe()`. Method chaining for readability. Reading large files in chunks. `dtypes` optimisation to reduce memory.

**Practical Output:** Take a large dataset (1M+ rows — use NYC Yellow Taxi data from NYC Open Data). Optimise it: convert columns to efficient dtypes, reduce memory usage by >50%, rewrite a slow loop-based cleaning function as a vectorised operation. Benchmark before vs after.

**Skills Unlocked:**
- Data Wrangling (`practice`) — `advanced`
- Pandas (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] Pandas Performance Tips — Rob Mulla — https://www.youtube.com/watch?v=SAFmrTnEHLg
- [ARTICLE] Enhancing performance — pandas.pydata.org — https://pandas.pydata.org/docs/user_guide/enhancingperf.html
- [INTERNAL_TEXT] `.apply()` with a lambda is the most common performance trap in data science code. It runs Python in a loop under the hood — on 1M rows, it's 10–100x slower than vectorised Pandas operations. The rule: if a vectorised Pandas or NumPy function exists for your operation, use it. If it doesn't, `.apply()` is acceptable for small datasets but should be refactored for large ones. Method chaining (`df.pipe(clean).pipe(engineer).pipe(validate)`) makes data pipelines readable and auditable — each step is a named, testable function.

---

### Topic 2.6 — PROJECT: Messy Data → Clean Insights
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–10 hrs

**Description:** Take a genuinely messy, real-world dataset through the full wrangling pipeline to a clean, analysis-ready state with documented findings.

**Requirements (learner sources their own dataset from Kaggle, data.gov, or open datasets):**
- Dataset must be messy: missing values, wrong types, duplicates, inconsistent formatting
- Full wrangling pipeline documented as a Jupyter Notebook:
  - Audit: document every quality issue found
  - Clean: apply appropriate fixes with justification for each decision
  - Reshape/Merge: combine with at least one supplementary dataset
  - SQL queries: answer 5 questions using SQLite
  - Summary: a written "data quality report" section at the end
- All code reusable functions (importable, not just notebook cells)
- Pushed to GitHub with a README explaining the dataset, the problems found, and the decisions made

**Skills Demonstrated:**
- Pandas (`framework_library`) — `advanced`
- Data Wrangling (`practice`) — `advanced`
- SQL (`language`) — `intermediate`

**Resources:**
- [ARTICLE] Kaggle Datasets — https://www.kaggle.com/datasets
- [ARTICLE] data.gov — US Open Data — https://data.gov/
- [INTERNAL_TEXT] Choosing your own dataset for this project is intentional. The discipline of finding, loading, and auditing a completely unknown dataset — with no instructions — is the core skill of a data scientist. The dataset you choose should be something you're genuinely curious about. Curiosity produces better analysis. When your questions are real, your investigation is thorough.

---

## Stage 3 — Exploratory Data Analysis & Visualisation
**Tagline:** Turn numbers into insights. Learn to see what the data is trying to say.
**Duration:** ~2.5 weeks

---

### Topic 3.1 — Matplotlib: The Foundation of Python Visualisation
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Beginner

**Description:** The Figure/Axes architecture. Basic charts: line, bar, scatter, histogram, pie. Customisation: titles, labels, legends, colours, grid, fonts. Subplots. Saving figures (PNG, PDF). Object-oriented vs pyplot API.

**Practical Output:** Recreate 6 common chart types on the Titanic dataset using Matplotlib's OO API: survival rate bar chart, age distribution histogram, fare vs age scatter, survival count per class, correlation matrix heatmap (manual). Save all as PNGs.

**Skills Unlocked:**
- Matplotlib (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Matplotlib Tutorial — Corey Schafer — https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_
- [ARTICLE] Matplotlib Tutorials — matplotlib.org — https://matplotlib.org/stable/tutorials/index.html
- [INTERNAL_TEXT] Matplotlib gives you complete control over every pixel in a chart — but that power comes with verbosity. The object-oriented API (`fig, ax = plt.subplots()`, then `ax.plot(...)`) is the professional way to use Matplotlib — it's explicit and composable, unlike the implicit `plt.plot()` style that confuses beginners. Learn the OO API now; it also makes Seaborn and Pandas plotting understandable because they wrap it.

---

### Topic 3.2 — Seaborn: Statistical Visualisation
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Beginner

**Description:** Seaborn's philosophy: statistical graphics with less code. Distribution plots: `histplot`, `kdeplot`, `boxplot`, `violinplot`. Relationship plots: `scatterplot`, `lineplot`, `regplot`. Categorical plots: `barplot`, `countplot`, `stripplot`. Pair plots. Heatmaps. Themes and palettes.

**Practical Output:** Build an EDA visualisation suite for the NYC Airbnb dataset using Seaborn: price distribution by neighbourhood (violinplot), price vs number of reviews (scatterplot with regression line), correlation heatmap of numeric columns, pairplot of price/reviews/availability, count of room types per neighbourhood group.

**Skills Unlocked:**
- Seaborn (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Seaborn Tutorial — freeCodeCamp — https://www.youtube.com/watch?v=6GUZXDef2U0
- [ARTICLE] Seaborn Tutorial — seaborn.pydata.org — https://seaborn.pydata.org/tutorial.html
- [INTERNAL_TEXT] Seaborn is built for exploratory data analysis — it adds statistical context to visuals automatically. A `boxplot` doesn't just show distribution shape; it marks the median, quartiles, and outliers in one chart. A `regplot` adds a regression line with confidence interval. The `hue` parameter lets you split any chart by a categorical variable to spot group-level patterns instantly. Think of Seaborn as Matplotlib with statistical intelligence baked in.

---

### Topic 3.3 — Plotly: Interactive Visualisation
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Why interactive charts? Plotly Express vs Plotly Graph Objects. Interactive scatter, bar, line, choropleth maps, sunburst charts. Hover tooltips. Exporting to HTML. Basic Plotly Dash intro (or Streamlit + Plotly integration).

**Practical Output:** Convert your static Airbnb EDA charts to interactive Plotly Express versions. Add a choropleth map of NYC neighbourhoods coloured by average listing price. Export the full set as a self-contained HTML file anyone can open and explore.

**Skills Unlocked:**
- Plotly (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Plotly Express Tutorial — Charming Data — https://www.youtube.com/watch?v=_b2KXL0wHQg
- [ARTICLE] Plotly Python — plotly.com — https://plotly.com/python/
- [INTERNAL_TEXT] Static charts belong in PDFs and academic papers. Interactive charts belong everywhere else. When a stakeholder can hover over a data point to see exact values, zoom into a time range, or filter by clicking a legend item — their questions get answered without a follow-up email to you. Plotly's `.to_html(include_plotlyjs='cdn')` exports a single HTML file that works in any browser with no dependencies — easy to share, email, or embed in a portfolio page.

---

### Topic 3.4 — The EDA Framework: A Structured Approach
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** A systematic EDA process: univariate → bivariate → multivariate analysis. Formulating questions before plotting. Feature relationships and correlation (Pearson, Spearman). Distribution shapes and what they mean. Skewness, kurtosis. Simpson's Paradox — why group-level insights can contradict individual-level data.

**Practical Output:** Perform a structured, question-driven EDA on the [World Happiness Report dataset](https://www.kaggle.com/datasets/unsdsn/world-happiness). Start with a list of 10 hypotheses ("I expect GDP to correlate strongly with happiness"). Test each one visually. Write a short narrative interpretation for each chart. End with 3 non-obvious insights you found.

**Skills Unlocked:**
- Exploratory Data Analysis (`practice`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] Exploratory Data Analysis — freeCodeCamp — https://www.youtube.com/watch?v=xi0vhXFPegw
- [ARTICLE] EDA Guide — Towards Data Science — https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15
- [INTERNAL_TEXT] The EDA process: (1) understand what each column means — domain knowledge first, code second. (2) Look at distributions of individual columns. (3) Look at relationships between pairs. (4) Look at relationships across 3+ dimensions simultaneously. The biggest EDA mistake beginners make is jumping straight to correlation matrices and scatterplot matrices without first understanding what the data represents. A chart without domain knowledge is just a picture.

---

### Topic 3.5 — Feature Engineering Basics
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** What is feature engineering? Deriving new features from existing ones. Binning continuous variables. Encoding categorical variables: label encoding, one-hot encoding, ordinal encoding, target encoding. Interaction features. Log transformations for skewed distributions.

**Practical Output:** Engineer 5 new features from the Airbnb NYC dataset: `price_per_review`, `listing_age` (from last review date), `is_superhostable` (reviews per month > 2), log-transformed price, one-hot encoded neighbourhood group. Compare the correlation of raw vs engineered features with price.

**Skills Unlocked:**
- Feature Engineering (`practice`) — `beginner`
- Pandas (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] Feature Engineering — Krish Naik — https://www.youtube.com/watch?v=6WDFfaYtN6s
- [ARTICLE] Feature Engineering for Machine Learning — Towards Data Science — https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114
- [INTERNAL_TEXT] Feature engineering is where domain knowledge meets technical skill — and it's often the difference between a model that scores 75% and one that scores 85% on the same dataset. Before touching a machine learning algorithm, ask: what transformations of the raw data might make patterns more learnable? Log-transforming a right-skewed price column reduces the influence of extreme values and often dramatically improves model performance on price prediction tasks.

---

### Topic 3.6 — PROJECT: EDA Report
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–12 hrs

**Description:** Perform a complete, publication-quality EDA on a dataset of your choice and write it up as an interactive report.

**Requirements:**
- Choose a dataset related to something you're genuinely interested in (sports, finance, health, music, etc.)
- Structured EDA: start with a list of questions, answer each one with at least one chart
- Minimum 12 visualisations: mix of Matplotlib, Seaborn, and Plotly
- Feature engineering: create at least 3 derived features and explain their rationale
- A written "Story" section: what does this data tell you that you didn't know before?
- Published as a Kaggle Notebook (makes it public and shareable) with a minimum of 5 upvotes from the community
- Also pushed to GitHub

**Skills Demonstrated:**
- Matplotlib (`framework_library`) — `beginner`
- Seaborn (`framework_library`) — `beginner`
- Plotly (`framework_library`) — `beginner`
- Exploratory Data Analysis (`practice`) — `intermediate`
- Feature Engineering (`practice`) — `beginner`

**Resources:**
- [ARTICLE] How to write a great Kaggle notebook — Kaggle Blog — https://www.kaggle.com/discussions/general/273726
- [INTERNAL_TEXT] Publishing on Kaggle serves two purposes: the community feedback loop (comments, upvotes, forking) accelerates your learning faster than any tutorial, and your public Kaggle profile becomes part of your data science portfolio. Hiring managers do look at Kaggle profiles. A notebook with 50+ upvotes is a credible signal of communication and analytical quality — not just code that runs.

---

## Stage 4 — Statistics & Probability Foundations
**Tagline:** Build the mathematical intuition that separates data scientists from data users.
**Duration:** ~2.5 weeks

---

### Topic 4.1 — Descriptive Statistics & Distributions
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Measures of central tendency and spread. Probability distributions: normal, binomial, Poisson, uniform. The Central Limit Theorem — why it matters for everything downstream. Sampling: random, stratified, systematic. Confidence intervals intuitively.

**Practical Output:** Use `scipy.stats` and Pandas to: fit a normal distribution to real housing price data, compute confidence intervals for mean price by neighbourhood, simulate 1,000 experiments to demonstrate the Central Limit Theorem visually.

**Skills Unlocked:**
- Statistics (`practice`) — `beginner`
- Python (`language`) — `intermediate`

**Resources:**
- [VIDEO] Statistics for Data Science — StatQuest with Josh Starmer — https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9
- [ARTICLE] scipy.stats — SciPy docs — https://docs.scipy.org/doc/scipy/reference/stats.html
- [INTERNAL_TEXT] The Central Limit Theorem is the single most important theorem in statistics for data science: regardless of the shape of the original distribution, the distribution of sample means approaches normal as sample size grows. This is why we can apply statistical tests to non-normal data. Josh Starmer's StatQuest YouTube channel is the best statistics resource ever made for practitioners — clear, visual, with minimal jargon. Watch the CLT video twice.

---

### Topic 4.2 — Hypothesis Testing
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** The logic of hypothesis testing. Null hypothesis, p-value, Type I and II errors, statistical power. Tests: t-test (one sample, two sample, paired), chi-square test of independence, ANOVA. When to use each. Effect size vs statistical significance. The p-value misconception.

**Practical Output:** Test 3 hypotheses on the Titanic dataset: (1) Did women have a significantly higher survival rate than men? (t-test). (2) Is there a significant association between passenger class and survival? (chi-square). (3) Does mean age differ significantly across passenger classes? (one-way ANOVA). Write a plain-English interpretation of each result.

**Skills Unlocked:**
- Statistics (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Hypothesis Testing — StatQuest with Josh Starmer — https://www.youtube.com/watch?v=0oc49DyA3hU
- [ARTICLE] Statistical tests in Python — scipy.stats — https://docs.scipy.org/doc/scipy/reference/stats.html
- [INTERNAL_TEXT] The p-value is the most misunderstood concept in data science. A p-value of 0.04 does NOT mean "there's a 96% chance the effect is real." It means "if the null hypothesis were true, there's a 4% chance of observing data at least this extreme." Effect size (Cohen's d, Cramer's V) tells you whether the effect is practically meaningful — a result can be statistically significant but so tiny it doesn't matter. Always report both.

---

### Topic 4.3 — Correlation, Causation & Regression Basics
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Pearson and Spearman correlation. The correlation ≠ causation principle and examples. Confounders. Simple linear regression: OLS, coefficients interpretation, R², residuals. Multiple linear regression. `statsmodels` for statistical regression (vs Scikit-learn which is ML-first).

**Practical Output:** Build a linear regression model using `statsmodels` to predict Airbnb listing price from: number of reviews, availability, minimum nights, room type, neighbourhood group. Interpret the coefficient for each predictor in plain English. Check residuals for heteroscedasticity.

**Skills Unlocked:**
- Statistics (`practice`) — `intermediate`
- Statsmodels (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Linear Regression — StatQuest with Josh Starmer — https://www.youtube.com/watch?v=nk2CQITm_eo
- [ARTICLE] statsmodels OLS — https://www.statsmodels.org/stable/regression.html
- [INTERNAL_TEXT] Use `statsmodels` when you care about statistical inference — p-values, confidence intervals, coefficient interpretability, R². Use Scikit-learn when you care about predictive performance — cross-validation, pipelines, hyperparameter tuning. These are two different goals. In data science you often need both: `statsmodels` to understand *why* a feature matters, Scikit-learn to build a model that actually predicts well.

---

### Topic 4.4 — Probability for Machine Learning
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Bayes' theorem intuitively. Prior, likelihood, posterior. Naive Bayes classifier concept. Information theory: entropy, information gain (used in decision trees). Log-likelihood. Why machine learning loss functions are rooted in probability.

**Practical Output:** Implement Naive Bayes from scratch on a text spam classification dataset (20 Newsgroups). Compare to `sklearn`'s `MultinomialNB`. Visualise the prior probabilities and the most informative words per class.

**Skills Unlocked:**
- Statistics (`practice`) — `advanced`
- Machine Learning (`practice`) — `beginner`

**Resources:**
- [VIDEO] Bayes Theorem — 3Blue1Brown — https://www.youtube.com/watch?v=HZGCoVF3YvM
- [ARTICLE] Naive Bayes — Towards Data Science — https://towardsdatascience.com/all-about-naive-bayes-8e13cef044cf
- [INTERNAL_TEXT] Bayes' theorem is the mathematical foundation of many ML algorithms — not just Naive Bayes, but also Bayesian optimisation (used for hyperparameter search) and probabilistic models. More importantly, understanding that model outputs are probability estimates (not certainties) is what separates thoughtful data scientists from algorithm runners. When a model says "70% probability of fraud" — what does that really mean? Bayes gives you the language to think about it rigorously.

---

### Topic 4.5 — A/B Testing & Experimentation
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** What is A/B testing? Experimental design: control/treatment, randomization. Sample size calculation. Running a t-test on A/B results. Multiple testing correction (Bonferroni, FDR). Practical pitfalls: novelty effect, peeking problem, Simpson's Paradox in experiments.

**Practical Output:** Analyse a simulated A/B test dataset (available on Kaggle: Udacity A/B Testing dataset). Determine: was the test powered correctly? Is the difference statistically significant? Is the effect size large enough to be practically meaningful? Should the new feature be shipped?

**Skills Unlocked:**
- Statistics (`practice`) — `advanced`
- Exploratory Data Analysis (`practice`) — `advanced`

**Resources:**
- [VIDEO] A/B Testing — Krish Naik — https://www.youtube.com/watch?v=zFMgpxG-chM
- [ARTICLE] Udacity A/B Testing course notes — https://storage.googleapis.com/supplemental_media/udacityu/1566803494/Lesson%201%20Notes.pdf
- [INTERNAL_TEXT] A/B testing is how technology companies make product decisions with statistical rigour. The "peeking problem" is the most common A/B testing mistake: stopping the experiment early because you saw a significant result in the first few days. Early significance is often a statistical artefact — you need to run the test for the pre-determined sample size regardless. In data science roles at tech companies, A/B testing analysis is a daily task and a frequent interview topic.

---

### Topic 4.6 — PROJECT: Statistical Analysis Report
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–10 hrs

**Description:** Apply statistical reasoning to answer a real business question from a dataset of your choice.

**Requirements:**
- Frame 3–5 business questions that can be answered with statistical tests
- For each: state null hypothesis, choose the appropriate test, compute and interpret the result
- At least one t-test, one chi-square test, and one correlation analysis
- A simulated A/B test: design an experiment, simulate the data, analyse results
- All findings written in plain language (no jargon) in a Jupyter Notebook with embedded charts
- Pushed to GitHub and/or published as a Kaggle Notebook

**Skills Demonstrated:**
- Statistics (`practice`) — `advanced`
- Exploratory Data Analysis (`practice`) — `advanced`
- Statsmodels (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Statistics with Python — Keith Galli — https://www.youtube.com/watch?v=lvmjbkZYMvA
- [INTERNAL_TEXT] The ability to translate a business question into a statistical test — and then translate the result back into a business recommendation — is what makes a data scientist valuable to a non-technical team. "Should we ship this feature?" should get an answer like "The test showed a 12% increase in conversion (p=0.02, Cohen's d=0.31). The effect is statistically significant and practically meaningful. I recommend shipping." Not a p-value and a shrug.

---

## Stage 5 — Machine Learning Fundamentals
**Tagline:** Build models that learn from data. Understand the mechanics before using the magic.
**Duration:** ~3 weeks

---

### Topic 5.1 — The Machine Learning Framework
**Type:** Lesson + Concept
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Supervised vs unsupervised vs reinforcement learning. Classification vs regression. The ML workflow: define problem → collect data → explore → engineer features → train model → evaluate → deploy. Train/validation/test split and why it matters. Bias-variance tradeoff intuitively.

**Practical Output:** For the Airbnb dataset: frame 2 versions of the problem — (1) predict price (regression), (2) predict whether a listing is "high-rated" >4.8 stars (classification). Document what features you'd use for each, how you'd split the data (consider temporal leakage), and what metrics you'd optimise for. No code yet — just written ML design.

**Skills Unlocked:**
- Machine Learning (`practice`) — `beginner`

**Resources:**
- [VIDEO] Machine Learning Fundamentals — StatQuest with Josh Starmer — https://www.youtube.com/watch?v=Gv9_4yMHFhI
- [ARTICLE] The ML Workflow — Google Machine Learning Crash Course — https://developers.google.com/machine-learning/crash-course/framing/ml-terminology
- [INTERNAL_TEXT] The biggest mistake beginners make in ML is treating it as: "load data → fit model → done." The workflow is: define the problem precisely → choose the right evaluation metric for that problem → split data correctly to prevent leakage → engineer features → train a baseline → iterate. The "define the problem" step is the most neglected and the most important. If you optimise for accuracy on an imbalanced dataset (99% class A), a model that predicts A every time scores 99% accuracy — but is useless.

---

### Topic 5.2 — Scikit-learn API & Preprocessing
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Scikit-learn's consistent API: `fit`, `transform`, `predict`, `fit_transform`. `Pipeline` and `ColumnTransformer`. Preprocessing: `StandardScaler`, `MinMaxScaler`, `LabelEncoder`, `OneHotEncoder`. `SimpleImputer`. Why fit on train only — and never on test.

**Practical Output:** Build a complete Scikit-learn preprocessing pipeline for the Airbnb price prediction task: impute missing numerics, scale numeric features, one-hot encode categoricals. Use `ColumnTransformer` to apply different steps to different columns. Fit on train only, transform both train and test.

**Skills Unlocked:**
- Scikit-learn (`framework_library`) — `beginner`
- Machine Learning (`practice`) — `beginner`

**Resources:**
- [VIDEO] Scikit-learn Tutorial — Corey Schafer — https://www.youtube.com/watch?v=0Lt9w-BxKFQ
- [ARTICLE] Scikit-learn Preprocessing — scikit-learn.org — https://scikit-learn.org/stable/modules/preprocessing.html
- [INTERNAL_TEXT] The "fit on train only, transform test" rule is the most critical data leakage prevention principle. If you fit a `StandardScaler` on all your data (including test), the test set's statistics influence the scaler — meaning your model "sees" the test set indirectly. In production, when you serve a new prediction, you transform it using the scaler fitted only on historical training data. Always replicate that process in your ML pipeline.

---

### Topic 5.3 — Classification: Logistic Regression, Decision Trees & KNN
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** Logistic regression: sigmoid function, decision boundary, probability interpretation. Decision trees: splits, information gain, overfitting. K-Nearest Neighbours: distance metrics, choosing K. Model evaluation for classification: accuracy, precision, recall, F1, AUC-ROC, confusion matrix. Cross-validation.

**Practical Output:** Predict Titanic survival with all three models. Evaluate each using cross-validated precision, recall, F1, and ROC AUC. Plot confusion matrices side by side. Write a recommendation: which model would you choose in production and why?

**Skills Unlocked:**
- Scikit-learn (`framework_library`) — `intermediate`
- Machine Learning (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Decision Trees — StatQuest with Josh Starmer — https://www.youtube.com/watch?v=7VeUPuFGJHk
- [ARTICLE] Scikit-learn Classification — https://scikit-learn.org/stable/supervised_learning.html
- [INTERNAL_TEXT] Choosing the right evaluation metric is more important than choosing the right algorithm. For a cancer detection model (rare disease, high cost of false negatives): optimise for recall, not accuracy. For a spam filter (where false positives ruin UX): optimise for precision. AUC-ROC measures how well a model distinguishes between classes across all thresholds — it's threshold-independent and the best single summary metric for binary classification when class imbalance isn't extreme.

---

### Topic 5.4 — Regression: Linear, Ridge, Lasso & Evaluation
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Linear regression for prediction. Polynomial regression. Regularisation: Ridge (L2) and Lasso (L1) — when and why. Hyperparameter tuning with `GridSearchCV`. Regression evaluation: MAE, MSE, RMSE, R². Residual analysis.

**Practical Output:** Predict Airbnb price using Linear, Ridge, and Lasso regression. Use `GridSearchCV` to find the best regularisation strength (α) for Ridge and Lasso. Compare the 3 models on RMSE and R². Plot predicted vs actual prices. Analyse the largest errors — what kind of listings does the model get wrong?

**Skills Unlocked:**
- Scikit-learn (`framework_library`) — `intermediate`
- Machine Learning (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Ridge and Lasso Regression — StatQuest — https://www.youtube.com/watch?v=NGf0voTMlcs
- [ARTICLE] Linear Models — scikit-learn.org — https://scikit-learn.org/stable/modules/linear_model.html
- [INTERNAL_TEXT] Regularisation is how you prevent overfitting in linear models. Lasso (L1) drives some coefficients to exactly zero — effectively performing feature selection. Ridge (L2) shrinks all coefficients towards zero but keeps all features. In practice: use Lasso when you suspect only a few features matter; use Ridge when you think most features contribute something. Always tune the regularisation parameter with cross-validation — the default is almost never optimal.

---

### Topic 5.5 — Unsupervised Learning: Clustering & Dimensionality Reduction
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** K-Means clustering: algorithm, choosing K (elbow method, silhouette score). DBSCAN: density-based clustering for non-spherical shapes. PCA: principal components, variance explained, 2D visualisation of high-dimensional data. t-SNE for visualisation.

**Practical Output:** Cluster Airbnb listings into natural market segments using K-Means. Use the elbow method to choose K. PCA-reduce to 2D for visualisation. Interpret each cluster: give it a descriptive name based on its properties (e.g. "Budget studios in Manhattan").

**Skills Unlocked:**
- Machine Learning (`practice`) — `intermediate`
- Scikit-learn (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] K-Means Clustering — StatQuest — https://www.youtube.com/watch?v=4b5d3muPQmA
- [ARTICLE] Clustering — scikit-learn.org — https://scikit-learn.org/stable/modules/clustering.html
- [INTERNAL_TEXT] Clustering is unsupervised learning — there are no labels telling the algorithm what's correct. The quality of clusters depends heavily on: what features you include, whether you've scaled them (K-Means uses Euclidean distance — unscaled features dominate), and the algorithm you choose. Interpreting clusters is as important as creating them. A cluster with no interpretable meaning has no business value. Name every cluster you find and write down what distinguishes it.

---

### Topic 5.6 — Model Selection, Evaluation & Avoiding Overfitting
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Cross-validation variants: K-fold, stratified K-fold, time-series split. Learning curves: diagnosing overfitting vs underfitting. Hyperparameter tuning: `GridSearchCV`, `RandomizedSearchCV`. Model selection: when complexity helps vs hurts. Baseline models and why you need them.

**Practical Output:** Build a comprehensive model comparison dashboard for the Titanic task: run 5 algorithms (Logistic Regression, Decision Tree, KNN, SVC, Random Forest) with cross-validated evaluation. Plot learning curves for the best model. Compute the baseline score (most-frequent class) and confirm your models beat it.

**Skills Unlocked:**
- Machine Learning (`practice`) — `advanced`
- Scikit-learn (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] Cross Validation — StatQuest — https://www.youtube.com/watch?v=fSytzGwwBVw
- [ARTICLE] Cross-validation — scikit-learn.org — https://scikit-learn.org/stable/modules/cross_validation.html
- [INTERNAL_TEXT] Always establish a baseline before evaluating any model. A baseline is the simplest possible prediction strategy: for classification, predict the most common class; for regression, predict the mean. If your model doesn't substantially beat the baseline, either the features contain no signal, the data is too noisy, or the model is underfit. Learning curves are your debugging tool: if training score is high but validation score is low → overfitting. If both are low → underfitting. Each diagnosis has a different fix.

---

### Topic 5.7 — PROJECT: Predictive Model
**Type:** Project (Milestone)
**Difficulty:** Intermediate → Advanced
**Estimated Time:** 12–16 hrs

**Description:** Build a complete, end-to-end machine learning pipeline for a real prediction problem.

**Requirements:**
- Choose a classification or regression problem with a real-world dataset (Kaggle or open data)
- Full ML pipeline in a single, reproducible Jupyter Notebook:
  - Data loading and EDA (condensed)
  - Feature engineering (minimum 5 new features)
  - Preprocessing pipeline with `Pipeline` + `ColumnTransformer`
  - Train 3+ different algorithms
  - Hyperparameter tuning on the best performer with `GridSearchCV`
  - Evaluate with cross-validation (not just a single train/test split)
  - Error analysis: which predictions were most wrong, and why?
  - A plain-English "findings" summary: what factors matter most for prediction?
- Pushed to GitHub with a polished README documenting the problem, approach, and results

**Skills Demonstrated:**
- Scikit-learn (`framework_library`) — `advanced`
- Machine Learning (`practice`) — `advanced`
- Feature Engineering (`practice`) — `intermediate`
- Pandas (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] End-to-End Machine Learning Project — Krish Naik — https://www.youtube.com/watch?v=fiz1ORTBGpY
- [ARTICLE] Scikit-learn Pipeline — https://scikit-learn.org/stable/modules/pipeline.html
- [INTERNAL_TEXT] This project is what employers actually look at. The code quality, the thought process, the error analysis, the plain-language explanation. A Jupyter notebook that only shows the winning model is unimpressive. A notebook that shows what you tried, why you made each decision, what surprised you, and where the model still fails — that is the work of a thoughtful data scientist.

---

## Stage 6 — Advanced ML & Ensembles
**Tagline:** Learn the models that win competitions and dominate production systems.
**Duration:** ~2.5 weeks

---

### Topic 6.1 — Ensemble Methods: Random Forest & Gradient Boosting
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Advanced

**Description:** Bagging vs boosting. Random Forests: how they work, feature importance, out-of-bag error. Gradient Boosting: the algorithm intuition. XGBoost, LightGBM, CatBoost: differences, when to use each. Hyperparameter tuning for boosting algorithms.

**Practical Output:** Build an XGBoost and a LightGBM model on the same dataset from Stage 5. Compare to Random Forest. Tune key hyperparameters (`n_estimators`, `max_depth`, `learning_rate`, `subsample`). Extract and visualise feature importances. Compute SHAP values for model explainability.

**Skills Unlocked:**
- XGBoost (`framework_library`) — `intermediate`
- Machine Learning (`practice`) — `advanced`

**Resources:**
- [VIDEO] XGBoost — StatQuest — https://www.youtube.com/watch?v=TyvYZ26alZs
- [ARTICLE] XGBoost Documentation — xgboost.readthedocs.io — https://xgboost.readthedocs.io/en/stable/
- [INTERNAL_TEXT] Gradient boosting algorithms (XGBoost, LightGBM, CatBoost) win most structured data Kaggle competitions — not deep learning. On tabular data with fewer than a few million rows, XGBoost with good features and tuning typically outperforms neural networks. This is why they're the industry standard for fraud detection, credit scoring, demand forecasting, and churn prediction. SHAP (SHapley Additive exPlanations) values explain individual predictions — critical for building ML systems where regulators or stakeholders need to understand why a decision was made.

---

### Topic 6.2 — Model Interpretability & Fairness
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Why interpretability matters (regulation, trust, debugging). SHAP values: global and local explanations. LIME for any black-box model. Partial Dependence Plots. Model fairness: detecting bias across demographic groups. Equal opportunity vs equalised odds.

**Practical Output:** Apply SHAP to your XGBoost model from Topic 6.1. Generate: (1) a global feature importance bar chart, (2) a beeswarm plot showing how each feature affects predictions, (3) a waterfall plot explaining a single prediction in plain English. Check if the model's error rate differs significantly across demographic subgroups (if applicable to your dataset).

**Skills Unlocked:**
- Machine Learning (`practice`) — `advanced`

**Resources:**
- [VIDEO] SHAP Values Explained — Krish Naik — https://www.youtube.com/watch?v=VB9uV-x0gtg
- [ARTICLE] SHAP Documentation — shap.readthedocs.io — https://shap.readthedocs.io/en/latest/
- [INTERNAL_TEXT] Model explainability is now a compliance requirement in many industries. EU's AI Act, US financial regulations, and GDPR all require that automated decisions affecting people can be explained. SHAP is the most rigorous method: it's rooted in game theory (Shapley values) and produces consistent, theoretically sound explanations. "The model gave this loan applicant a low score primarily because their debt-to-income ratio was in the top 5%." That's the level of explanation regulators expect.

---

### Topic 6.3 — Handling Imbalanced Datasets
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Why accuracy fails on imbalanced data. Oversampling: SMOTE. Undersampling: RandomUnderSampler. Class weights. Threshold tuning. Evaluation metrics for imbalanced problems: Precision-Recall curve, Average Precision, Matthews Correlation Coefficient.

**Practical Output:** Work with a highly imbalanced credit card fraud dataset (available on Kaggle). Train a baseline XGBoost. Then improve using: (1) class weights, (2) SMOTE oversampling, (3) threshold tuning. Compare Precision-Recall AUC across all approaches. Write a recommendation.

**Skills Unlocked:**
- Machine Learning (`practice`) — `advanced`
- Scikit-learn (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] SMOTE Oversampling — Krish Naik — https://www.youtube.com/watch?v=FheTDyCwRdE
- [ARTICLE] imbalanced-learn docs — https://imbalanced-learn.org/stable/
- [INTERNAL_TEXT] Fraud detection, disease prediction, and anomaly detection are all imbalanced problems — the event you care about (fraud, disease) is rare. Accuracy is a useless metric on a dataset that's 99% not-fraud: a model that predicts "not fraud" for everything scores 99% accuracy. Use Precision-Recall AUC instead. SMOTE (Synthetic Minority Oversampling Technique) creates synthetic minority samples by interpolating between real ones — but it can introduce noise. Always compare SMOTE to simple class weighting before committing to it.

---

### Topic 6.4 — Feature Selection & Dimensionality Reduction
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Filter methods: correlation-based selection, chi-square test. Wrapper methods: recursive feature elimination (RFE). Embedded methods: Lasso regularisation, tree-based importance. PCA for dimensionality reduction before modelling. Feature selection pipeline in Scikit-learn.

**Practical Output:** On a high-dimensional dataset (100+ features — e.g. the [Santander Customer Transaction Prediction](https://www.kaggle.com/c/santander-customer-transaction-prediction)): reduce from 200 to 50 features using RFE with an XGBoost estimator. Compare model performance before and after. Try PCA instead of RFE — does performance differ?

**Skills Unlocked:**
- Machine Learning (`practice`) — `advanced`
- Scikit-learn (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] Feature Selection — Krish Naik — https://www.youtube.com/watch?v=vUstzHqr_Zk
- [ARTICLE] Feature Selection — scikit-learn.org — https://scikit-learn.org/stable/modules/feature_selection.html
- [INTERNAL_TEXT] More features is not always better. Irrelevant features add noise, slow training, and can decrease model performance — the curse of dimensionality. Feature selection is particularly important when: (1) you have more features than samples, (2) you need an interpretable model (fewer features = clearer story), (3) inference latency matters in production. Tree-based feature importances are the fastest filter; RFE is slower but more principled because it actually measures how removing each feature affects model performance.

---

### Topic 6.5 — Time Series Forecasting
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Time series ML: lag features, rolling features, seasonality encoding. Prophet for trend/seasonality modelling (Meta's library, simple and powerful). ARIMA basics. Proper time series cross-validation (no future leakage). Evaluation: MAE, RMSE, MAPE.

**Practical Output:** Forecast monthly retail sales 6 months ahead using the [Rossmann Store Sales dataset](https://www.kaggle.com/c/rossmann-store-sales). Engineer lag features and rolling averages. Train XGBoost with time-series cross-validation. Also fit Prophet and compare. Visualise forecast vs actual on the holdout period.

**Skills Unlocked:**
- Machine Learning (`practice`) — `advanced`
- Feature Engineering (`practice`) — `advanced`

**Resources:**
- [VIDEO] Time Series Forecasting — Rob Mulla — https://www.youtube.com/watch?v=e8Yw4alG16Q
- [ARTICLE] Prophet Documentation — facebook.github.io — https://facebook.github.io/prophet/docs/quick_start.html
- [INTERNAL_TEXT] Time series forecasting requires a different mindset from standard ML: the past cannot "see" the future. When creating lag features, a lag-7 feature (value 7 days ago) must never include data that wouldn't have been available at prediction time. This is "temporal leakage" — it's why you must use `TimeSeriesSplit` in cross-validation instead of regular K-fold. Prophet is particularly good for business time series with daily seasonality and known holidays — you can inject custom holiday effects and it handles missing data gracefully.

---

### Topic 6.6 — PROJECT: Kaggle Competition Entry
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 15–20 hrs

**Description:** Enter a live or practice Kaggle competition and submit a real entry.

**Requirements:**
- Enter an active or practice competition on Kaggle (e.g. Titanic, House Prices, or a current active competition)
- Complete end-to-end pipeline: EDA → feature engineering → baseline model → advanced model → ensembling
- At least 3 different model types tried (XGBoost, LightGBM, or Random Forest as options)
- Feature importance analysis with SHAP
- Submit at least 5 versions with different approaches — document in a notebook what changed and the leaderboard impact
- Final score: aim to beat at least 75% of the competition's public leaderboard
- Write a "competition debrief" notebook: what worked, what didn't, what would you try next

**Skills Demonstrated:**
- XGBoost (`framework_library`) — `intermediate`
- Machine Learning (`practice`) — `advanced`
- Feature Engineering (`practice`) — `advanced`
- Scikit-learn (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] How to Compete on Kaggle — Rob Mulla — https://www.youtube.com/watch?v=GJBBDzTAASc
- [ARTICLE] Kaggle Learn + Competitions — https://www.kaggle.com/competitions
- [INTERNAL_TEXT] Kaggle competitions are the closest thing to a job interview simulation in data science. The feedback loop is tight: you submit, you see your score relative to thousands of other participants, you iterate. The leaderboard position doesn't matter as much as the debrief — what did you learn? The learners who get hired from Kaggle are those who can explain why each experiment they tried either worked or failed, not just those who got the best score.

---

## Stage 7 — Deep Learning & NLP Basics
**Tagline:** Learn neural networks from first principles. Build a model that reads text.
**Duration:** ~3 weeks

---

### Topic 7.1 — Neural Networks from Scratch
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Advanced

**Description:** The perceptron. Multilayer networks. Forward pass: weighted sum + activation functions (ReLU, sigmoid, softmax). Backpropagation intuition (no full calculus required). Loss functions: cross-entropy, MSE. Gradient descent: batch, mini-batch, stochastic. Implement a 2-layer network in pure NumPy.

**Practical Output:** Implement a simple 2-layer neural network in pure NumPy for binary classification (no PyTorch or TensorFlow). Train it on a toy dataset. Plot the loss curve. Verify predictions match reasonable expectations. Then replicate the same network in PyTorch to compare code style.

**Skills Unlocked:**
- Deep Learning (`practice`) — `beginner`
- PyTorch (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Neural Networks from Scratch — Sentdex — https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebJ80bFMGq_1AAAQ
- [ARTICLE] Neural Networks and Deep Learning — Michael Nielsen — http://neuralnetworksanddeeplearning.com/
- [INTERNAL_TEXT] Implementing a neural network from scratch in NumPy is the most clarifying exercise in deep learning. When you write `output = sigmoid(np.dot(W, input) + b)` and then derive the gradient update by hand — backpropagation stops being mysterious. You understand why vanishing gradients happen with sigmoid, why ReLU is usually better, and why batch size affects training stability. This understanding makes debugging real PyTorch models dramatically easier.

---

### Topic 7.2 — PyTorch Fundamentals
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Advanced

**Description:** Tensors: creation, operations, GPU vs CPU. Autograd: automatic differentiation. Building models with `nn.Module`. Custom datasets and `DataLoader`. Training loop: forward pass → loss → backward → update. Model saving and loading.

**Practical Output:** Build a PyTorch neural network classifier for the MNIST handwritten digits dataset (the "hello world" of deep learning). Achieve >98% test accuracy. Plot training/validation loss and accuracy curves. Save the trained model.

**Skills Unlocked:**
- PyTorch (`framework_library`) — `beginner` → `intermediate`
- Deep Learning (`practice`) — `beginner`

**Resources:**
- [VIDEO] PyTorch for Deep Learning — freeCodeCamp — https://www.youtube.com/watch?v=V_xro1bcAuA
- [ARTICLE] PyTorch Tutorial — pytorch.org — https://pytorch.org/tutorials/beginner/basics/intro.html
- [INTERNAL_TEXT] PyTorch is the dominant framework for research and production ML in 2026. Its dynamic computation graph (define-by-run) makes debugging natural — you can add a `print()` anywhere in your model and it works. The training loop in PyTorch is explicit: zero gradients → forward pass → compute loss → backward pass → update weights. Understanding this loop deeply means you'll never be confused about when to call `optimizer.zero_grad()` or why `loss.backward()` must come before `optimizer.step()`.

---

### Topic 7.3 — Text Processing & NLP Fundamentals
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Text preprocessing: tokenization, lowercasing, stopword removal, stemming/lemmatization. Bag of Words, TF-IDF. Word embeddings: Word2Vec intuition, pre-trained embeddings. `spaCy` for NLP tasks. Named Entity Recognition. Sentiment analysis as a classification problem.

**Practical Output:** Build a sentiment analyser on the [Amazon Product Reviews](https://www.kaggle.com/datasets/bittlingmayer/amazonreviews) dataset. Pipeline: preprocess text (tokenize, remove stopwords) → TF-IDF features → Logistic Regression classifier → evaluate with precision/recall/F1 per class. Compare TF-IDF to pre-trained word2vec embeddings.

**Skills Unlocked:**
- NLP (`practice`) — `beginner`
- Scikit-learn (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] NLP with Python — freeCodeCamp — https://www.youtube.com/watch?v=M7SWr5xObkA
- [ARTICLE] spaCy 101 — spacy.io — https://spacy.io/usage/spacy-101
- [INTERNAL_TEXT] NLP tasks — sentiment analysis, topic modelling, text classification, named entity recognition — are among the most commercially valuable data science applications. The fundamental pipeline: raw text → tokens → numerical representation → model. TF-IDF (Term Frequency-Inverse Document Frequency) scores words by how often they appear in a document weighted against how common they are across all documents — common words like "the" get low scores; rare but meaningful words get high scores. It's often the strongest baseline for text classification.

---

### Topic 7.4 — Transfer Learning & Transformers (Practical)
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** What is transfer learning? Using pre-trained models from HuggingFace. `transformers` library: tokenizers, pre-trained models, fine-tuning for text classification. BERT for sentiment analysis. When to fine-tune vs when to use embeddings as features.

**Practical Output:** Fine-tune a pre-trained DistilBERT model (small, fast) on a text classification dataset using HuggingFace Transformers. Compare performance to the TF-IDF + Logistic Regression baseline from Topic 7.3. Benchmark training time and accuracy.

**Skills Unlocked:**
- NLP (`practice`) — `intermediate`
- Deep Learning (`practice`) — `intermediate`
- PyTorch (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] HuggingFace Transformers — Andrej Karpathy / HuggingFace — https://www.youtube.com/watch?v=1pedAIvTWXk
- [ARTICLE] HuggingFace Transformers — huggingface.co — https://huggingface.co/docs/transformers/index
- [INTERNAL_TEXT] Transfer learning is the most important paradigm shift in modern AI. Instead of training a model from scratch on your specific task (which requires massive data and compute), you take a model pre-trained on billions of text tokens and fine-tune it on your few thousand examples. DistilBERT is 40% smaller than BERT but retains 97% of its performance — a sensible trade-off for learning projects and production systems where latency matters. The HuggingFace ecosystem is the industry standard for NLP in 2026.

---

### Topic 7.5 — Convolutional Neural Networks (Image Classification)
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** How CNNs work: convolutions, filters, pooling, feature maps. Architecture overview: LeNet, VGG, ResNet. Transfer learning for images: using pre-trained ResNet from `torchvision.models`. Data augmentation. Training a classifier on custom images.

**Practical Output:** Build an image classifier using a pre-trained ResNet18 (transfer learning) on a small dataset of your choice from Kaggle (e.g. [Flowers Recognition](https://www.kaggle.com/datasets/alxmamaev/flowers-recognition), 5 classes). Fine-tune the last layer only. Achieve >85% test accuracy. Visualise which parts of the image the model focuses on (Grad-CAM).

**Skills Unlocked:**
- Deep Learning (`practice`) — `intermediate`
- PyTorch (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] CNN Explained — StatQuest — https://www.youtube.com/watch?v=HGwBXDKFk9I
- [ARTICLE] PyTorch Transfer Learning Tutorial — pytorch.org — https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html
- [INTERNAL_TEXT] Convolutional layers are not magic — each filter is a small matrix that slides across an image, detecting a specific pattern (edge, texture, colour gradient). Early layers detect simple patterns; deeper layers detect complex ones (eyes, wheels, faces). Transfer learning works because these learned features are general — a model trained on ImageNet's 1.2M images learns filters useful for almost any visual recognition task. You fine-tune only the final layer (which maps features to your specific classes) while keeping the earlier feature detectors frozen.

---

### Topic 7.6 — PROJECT: Text Classifier
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 12–16 hrs

**Description:** Build a complete NLP classification system from raw text to a deployed prediction API.

**Requirements:**
- Choose a text classification task: sentiment, topic, spam, intent, or toxicity detection
- Baseline: TF-IDF + Logistic Regression with cross-validation
- Advanced: fine-tuned DistilBERT or similar HuggingFace model
- Proper evaluation: per-class precision/recall/F1, confusion matrix, error analysis (which texts does the model misclassify?)
- Model saved to disk with all preprocessing steps
- A Streamlit app that lets anyone enter a text and get a prediction + confidence score (deployed to Streamlit Cloud — free)
- GitHub repo with README, requirements.txt, and live Streamlit URL

**Skills Demonstrated:**
- NLP (`practice`) — `intermediate`
- Deep Learning (`practice`) — `intermediate`
- PyTorch (`framework_library`) — `intermediate`
- Streamlit (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Streamlit for Data Science — freeCodeCamp — https://www.youtube.com/watch?v=JwSS70SZdyM
- [ARTICLE] Streamlit Documentation — https://docs.streamlit.io/
- [INTERNAL_TEXT] A model that lives only in a notebook is invisible. A model with a live URL that anyone can demo in 30 seconds is a portfolio piece. Streamlit transforms a Python script into a web app with almost no extra code — `st.text_input()`, `st.button()`, `st.write()` cover most use cases. Streamlit Cloud deploys from GitHub for free. This project should be the first link in your portfolio — something you can open on a phone during a coffee chat and demo instantly.

---

## Stage 8 — MLOps, Deployment & Capstone
**Tagline:** Make ML real. Build something that runs in production, tracked, versioned, and maintainable.
**Duration:** ~3 weeks

---

### Topic 8.1 — MLflow: Experiment Tracking & Model Registry
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** What is MLOps? The reproducibility problem in ML. MLflow: tracking experiments (params, metrics, artifacts). Model registry: versioning, staging, production. Comparing runs. Logging Scikit-learn and XGBoost models.

**Practical Output:** Refactor your Stage 5 ML project to log every experiment to MLflow: hyperparameters, metrics (train/val RMSE, R²), feature importance plots as artifacts. Run 10 experiments with different hyperparameters. Use the MLflow UI to compare them and identify the best run. Register the best model.

**Skills Unlocked:**
- MLOps (`practice`) — `beginner`
- MLflow (`tool`) — `beginner`

**Resources:**
- [VIDEO] MLflow Tutorial — freeCodeCamp — https://www.youtube.com/watch?v=kshjh3MDpDU
- [ARTICLE] MLflow Documentation — mlflow.org — https://mlflow.org/docs/latest/index.html
- [INTERNAL_TEXT] Without experiment tracking, ML development is chaos — you forget which hyperparameters produced which result, you can't compare experiments reproducibly, and you can't roll back to a better model version. MLflow solves this with four components: Tracking (log params and metrics), Projects (package code for reproducibility), Models (standard format for any ML model), and Registry (version control for models). It's the industry standard and used at Netflix, Microsoft, and thousands of other companies.

---

### Topic 8.2 — Deploying ML Models as APIs
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** FastAPI for serving ML models. Request/response schema with Pydantic. Loading saved models at startup. Prediction endpoint. Input validation. Containerising with Docker. Deploying to a cloud service (Render free tier or Railway).

**Practical Output:** Wrap your Stage 5 best model in a FastAPI endpoint: `POST /predict` accepts a JSON body of features and returns `{ prediction, probability, model_version }`. Containerise with Docker. Deploy to Render. Share the live URL.

**Skills Unlocked:**
- MLOps (`practice`) — `intermediate`
- Docker (`tool`) — `beginner`

**Resources:**
- [VIDEO] FastAPI for ML — Krish Naik — https://www.youtube.com/watch?v=b5F667g1yCk
- [ARTICLE] FastAPI Documentation — fastapi.tiangolo.com — https://fastapi.tiangolo.com/
- [INTERNAL_TEXT] A Jupyter notebook cannot serve production traffic. To use a model in a real product — a mobile app, a web app, a backend service — it needs to be behind an API endpoint. FastAPI is the standard for ML APIs in Python: it generates automatic documentation, validates inputs with Pydantic schemas (rejecting malformed requests before they hit your model), and is fast enough for production traffic. The pattern: load model once at startup, serve predictions per request. Never load the model per request — it's too slow.

---

### Topic 8.3 — Building Interactive Data Apps with Streamlit
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Advanced Streamlit: multi-page apps, session state, caching (`@st.cache_data`), forms, file uploaders, charting with Plotly + Streamlit. Deploying to Streamlit Cloud. Building dashboards for non-technical stakeholders.

**Practical Output:** Build a multi-page data dashboard for your Kaggle EDA project (Stage 3): one page for raw data exploration (upload a CSV → instant summary), one page for visualisations (interactive Plotly charts), one page for model prediction (input features → predicted outcome). Deploy to Streamlit Cloud.

**Skills Unlocked:**
- Streamlit (`framework_library`) — `intermediate`
- MLOps (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Advanced Streamlit — Data Professor — https://www.youtube.com/watch?v=ZZ4B0QUHuNc
- [ARTICLE] Streamlit App Gallery — https://streamlit.io/gallery
- [INTERNAL_TEXT] Stakeholders don't use Jupyter notebooks. They use browser tabs. Streamlit bridges the gap: you write Python, stakeholders get a web app. The `@st.cache_data` decorator is critical for dashboards — it caches expensive operations (loading a dataset, training a model) so the app feels instant on every interaction. For model demos in interviews, a polished Streamlit app is worth 10 notebooks. It shows you think about the end user, not just the algorithm.

---

### Topic 8.4 — Data Pipelines & Automation
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Advanced

**Description:** What is a data pipeline? ETL vs ELT. Scheduling Python scripts. `schedule` library for simple cron-like jobs. Introduction to Apache Airflow (concepts only — DAGs, tasks, scheduling). Data validation in pipelines with Great Expectations or Pydantic.

**Practical Output:** Automate the data collection for your capstone: write a Python script that fetches fresh data from an API daily, cleans it, and appends it to a local Parquet file. Add validation: if any column has >10% missing values, log a warning and send an email alert (using `smtplib` or Resend).

**Skills Unlocked:**
- MLOps (`practice`) — `intermediate`
- Data Wrangling (`practice`) — `advanced`

**Resources:**
- [VIDEO] Apache Airflow Tutorial — TechWorld with Nana — https://www.youtube.com/watch?v=AHMm1wfGuHE
- [ARTICLE] schedule library — https://schedule.readthedocs.io/en/stable/
- [INTERNAL_TEXT] In production, data science isn't a one-time analysis. It's a pipeline that runs daily, weekly, or in real-time — collecting fresh data, cleaning it, retraining or scoring models, and surfacing results. Data validation is non-negotiable: a pipeline that silently consumes corrupted data and produces wrong predictions is worse than a pipeline that fails loudly. "Monitor your data like you monitor your code" — schema changes, missing values, distribution shifts all need to be detected and alerted on.

---

### Topic 8.5 — PROJECT: Capstone — Deployed ML App
**Type:** Project (Milestone — Capstone)
**Difficulty:** Advanced
**Estimated Time:** 30–50 hrs
**Note:** This is the graduation project. It represents the full capability of a junior data scientist.

**Description:** Build a complete, original, end-to-end data science product. The domain should be something you genuinely care about.

**Requirements:**
- An original problem — not a tutorial clone
- Real data: sourced yourself (API, web scraping, or a dataset you justified choosing)
- Full EDA with documented insights (Jupyter Notebook, well-narrated)
- Feature engineering: at least 8 derived features with rationale
- Model comparison: at least 3 algorithms evaluated with cross-validation
- Best model: tuned with hyperparameter search, evaluated on held-out test set
- MLflow experiment tracking: every experiment logged, best model registered
- FastAPI prediction endpoint deployed (Render or Railway)
- Streamlit dashboard: EDA visualisations + prediction interface (deployed to Streamlit Cloud)
- Written report: problem statement, data sources, approach, results, limitations, and what you'd do next
- GitHub repo: clean notebooks, src/ folder with reusable modules, requirements.txt, README with live URLs and screenshots

**Skills Demonstrated:** All path skills at their maximum level.

**Resources:**
- [ARTICLE] How to structure an ML project — Cookiecutter Data Science — https://drivendata.github.io/cookiecutter-data-science/
- [INTERNAL_TEXT] Your capstone is the conversation starter in every data science interview. "Walk me through a project you built from scratch." This is that project. The written report matters as much as the code — data scientists must communicate findings to non-technical stakeholders. The live Streamlit demo matters as much as the model accuracy — it shows you can ship something real. Make it something you'd be excited to talk about for 45 minutes.

---

## Full Skills Catalog for This Path

| Skill | Category | Max Level |
|-------|----------|-----------|
| Python | `language` | `advanced` |
| SQL | `language` | `intermediate` |
| NumPy | `framework_library` | `beginner` |
| Pandas | `framework_library` | `advanced` |
| Matplotlib | `framework_library` | `beginner` |
| Seaborn | `framework_library` | `beginner` |
| Plotly | `framework_library` | `beginner` |
| Scikit-learn | `framework_library` | `advanced` |
| XGBoost | `framework_library` | `intermediate` |
| Statsmodels | `framework_library` | `beginner` |
| PyTorch | `framework_library` | `intermediate` |
| Streamlit | `framework_library` | `intermediate` |
| Jupyter | `tool` | `beginner` |
| MLflow | `tool` | `beginner` |
| Docker | `tool` | `beginner` |
| Kaggle | `platform_service` | `intermediate` |
| REST API consumption | `practice` | `beginner` |
| Data Wrangling | `practice` | `advanced` |
| Exploratory Data Analysis | `practice` | `advanced` |
| Feature Engineering | `practice` | `advanced` |
| Statistics | `practice` | `advanced` |
| Machine Learning | `practice` | `advanced` |
| Deep Learning | `practice` | `intermediate` |
| NLP | `practice` | `intermediate` |
| MLOps | `practice` | `intermediate` |

**Total: 25 skills**

---

## Certificate Suggestions

### Stage 1 Certificate Suggestion
*(After: Data Exploration Script project)*

**Certificate:** HackerRank — Python (Basic) Skill Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/python_basic
**Cost:** `free`
**cost_note:** Free assessment, shareable LinkedIn badge, employer-visible on HackerRank
**Trigger:** `on_stage_complete`
**Why now:** You've built a real Python data script and know Pandas, NumPy, and file I/O. The HackerRank Python Basic cert validates these fundamentals. It takes about 90 minutes and covers data types, functions, and OOP — all things you now know from a data perspective. Stack it on LinkedIn alongside your GitHub project for immediate credibility.

---

### Stage 2 Certificate Suggestion
*(After: Messy Data → Clean Insights project)*

**Certificate:** Kaggle — Pandas Micro-Certificate + Data Cleaning Micro-Certificate
**Provider:** Kaggle
**URL:** https://www.kaggle.com/learn/pandas
**Cost:** `free`
**cost_note:** 100% free, certificate shareable on LinkedIn, both courses take ~4 hrs total
**Trigger:** `on_stage_complete`
**Why now:** Both Kaggle micro-courses (Pandas and Data Cleaning) are easier than what you've built — you can complete them quickly to formalise your skills and earn the certificates. They also introduce you to Kaggle's notebook environment, which is where your Stage 3 EDA report will live. Two free certificates from a platform hiring managers know is a fast win.

---

### Stage 3 Certificate Suggestion
*(After: EDA Report project)*

**Certificate:** Kaggle — Data Visualization Micro-Certificate
**Provider:** Kaggle
**URL:** https://www.kaggle.com/learn/data-visualization
**Cost:** `free`
**cost_note:** 100% free, certificate shareable on LinkedIn, ~4 hrs
**Trigger:** `on_stage_complete`
**Why now:** Your EDA report already demonstrates visualisation skill beyond this course — but the certificate formalises it and adds to your Kaggle profile. Your public Kaggle EDA notebook combined with the Data Visualization certificate creates a consistent signal to recruiters: this person can both analyse and communicate data.

---

### Stage 4 Certificate Suggestion
*(After: Statistical Analysis Report project)*

**Certificate:** freeCodeCamp — Data Analysis with Python Certification
**Provider:** freeCodeCamp
**URL:** https://www.freecodecamp.org/learn/data-analysis-with-python/
**Cost:** `free`
**cost_note:** Fully free, LinkedIn-addable verified certificate
**Trigger:** `on_stage_complete`
**Why now:** The freeCodeCamp Data Analysis with Python cert covers Python, NumPy, Pandas, Matplotlib, and Seaborn — the exact foundation you've spent 4 stages building. At this point you're beyond what the cert teaches, so you can complete the projects quickly. This cert is widely recognised by recruiters and appears in job postings as a credential signal.

---

### Stage 5 Certificate Suggestion
*(After: Predictive Model project)*

**Certificate:** Kaggle — Intro to Machine Learning + Intermediate ML Micro-Certificates
**Provider:** Kaggle
**URL:** https://www.kaggle.com/learn/intro-to-machine-learning
**Cost:** `free`
**cost_note:** 100% free, two certificates, ~6 hrs total
**Trigger:** `on_stage_complete`
**Why now:** Two Kaggle ML micro-certificates (Intro to ML and Intermediate ML) validate Scikit-learn, cross-validation, pipelines, and XGBoost — the core tools of Stage 5. They're completable in a weekend given your existing knowledge. Adding them to a Kaggle profile that already has EDA notebooks and a competition entry creates a compelling data science portfolio page.

---

### Stage 8 Certificate Suggestion
*(After: Deployed ML App capstone)*

**Certificate:** IBM Data Science Professional Certificate
**Provider:** IBM / Coursera
**URL:** https://www.coursera.org/professional-certificates/ibm-data-science
**Cost:** `free_audit`
**cost_note:** Free to audit all 9 courses. ~$49/month for graded certificate and IBM digital badge. Financial aid available. Earns ACE credit (up to 12 college credits).
**Trigger:** `on_stage_complete`
**Why now:** After completing the full path, you're technically beyond most of what IBM's 9-course program covers. But the IBM brand carries significant weight with enterprise recruiters, the IBM Digital Badge is displayed on Credly (an employer-facing credential platform), and it includes Python, SQL, data visualisation, ML, and an applied capstone — all of which you can demonstrate with your existing projects. The Credly badge on your LinkedIn profile is a clear trust signal for enterprise hiring managers.

---

## Certificate Summary Table

| After Stage | Certificate | Provider | Cost | LinkedIn-addable |
|---|---|---|---|---|
| Stage 1 | Python (Basic) Skill | HackerRank | Free | ✓ |
| Stage 2 | Pandas + Data Cleaning | Kaggle | Free | ✓ |
| Stage 3 | Data Visualization | Kaggle | Free | ✓ |
| Stage 4 | Data Analysis with Python | freeCodeCamp | Free | ✓ |
| Stage 5 | Intro to ML + Intermediate ML | Kaggle | Free | ✓ |
| Stage 8 | IBM Data Science Professional | IBM / Coursera | Free audit / ~$49/mo cert | ✓ |

---

## Opportunity Analyzer Tags

Skills that map directly to data science / ML job postings (based on LinkedIn/Indeed analysis, 2025–2026):

**High demand (>70% of data science postings):**
Python, Pandas, SQL, Scikit-learn, Machine Learning, Data Wrangling, Exploratory Data Analysis

**Medium demand (40–70%):**
Statistics, Matplotlib/Seaborn, Feature Engineering, XGBoost, NumPy, Jupyter, Kaggle

**Good to have (<40%):**
PyTorch, Deep Learning, NLP, MLflow, Streamlit, MLOps, Docker, Time Series

---

## Progression Rules

- Stages 1–5 are sequential and mandatory — no skipping.
- Learners who already know Python can self-assess to skip Stage 1 and begin at Stage 2.
- Each stage requires the milestone project to be submitted before the next stage unlocks.
- Topics within a stage can be completed in any order.
- Every completed project immediately appears in the learner's Portfolio Hub.
- The Capstone (Stage 8, Topic 8.5) is the path's graduation project — completing it unlocks a "Data Science Graduate" badge on the learner's profile.
- Kaggle notebooks (published as part of Stages 3, 5, and 6) are tracked separately in the Portfolio Hub as external links.
