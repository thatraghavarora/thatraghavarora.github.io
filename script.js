const reveals = document.querySelectorAll(".section, .hero-card, .skill-card, .project-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal", "visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});

const githubProjects = document.getElementById("githubProjects");
if (githubProjects) {
  const username = "thatraghavarora";
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("GitHub fetch failed");
      }
      return response.json();
    })
    .then((repos) => {
      if (!Array.isArray(repos) || repos.length === 0) {
        githubProjects.innerHTML = `
          <div class="col-12">
            <div class="project-card">
              <h3 class="h5">No public repositories found.</h3>
              <p>Make sure the repositories are public on GitHub.</p>
            </div>
          </div>
        `;
        return;
      }

      githubProjects.innerHTML = repos
        .map((repo) => {
          const description = repo.description || "No description yet.";
          const language = repo.language ? `<span class="tag">${repo.language}</span>` : "";
          const stars = `<span class="tag">★ ${repo.stargazers_count}</span>`;
          const forks = `<span class="tag">⑂ ${repo.forks_count}</span>`;
          const updated = new Date(repo.updated_at).toLocaleDateString();

          return `
            <div class="col-md-6 col-lg-4">
              <a class="project-card repo-card" href="${repo.html_url}" target="_blank" rel="noreferrer">
                <h3 class="h5">${repo.name}</h3>
                <p>${description}</p>
                <div class="project-meta">
                  ${language}
                  ${stars}
                  ${forks}
                  <span class="tag">Updated ${updated}</span>
                </div>
              </a>
            </div>
          `;
        })
        .join("");

      const newCards = githubProjects.querySelectorAll(".repo-card");
      newCards.forEach((card) => {
        card.classList.add("reveal");
        observer.observe(card);
      });
    })
    .catch(() => {
      githubProjects.innerHTML = `
        <div class="col-12">
          <div class="project-card">
            <h3 class="h5">Unable to load GitHub projects.</h3>
            <p>GitHub API rate limits may be hit. Please refresh later.</p>
          </div>
        </div>
      `;
    });
}
