import { useState } from "react";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  updated_at: string;
}

export default function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchUser() {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData: GitHubUser = await userRes.json();
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      );
      const reposData: GitHubRepo[] = await reposRes.json();
      setUser(userData);
      setRepos(reposData);
    } catch {
      setError("User not found. Please check the username and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") searchUser();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
    });
  }

  const languageColor: Record<string, string> = {
    Python: "bg-blue-100 text-blue-800",
    JavaScript: "bg-yellow-100 text-yellow-800",
    TypeScript: "bg-blue-100 text-blue-700",
    "C#": "bg-purple-100 text-purple-800",
    Java: "bg-orange-100 text-orange-800",
    CSS: "bg-pink-100 text-pink-800",
    HTML: "bg-red-100 text-red-800",
    Go: "bg-cyan-100 text-cyan-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            GitHub Profile Finder
          </h1>
          <p className="text-gray-500">
            Search any GitHub user to view their profile and repositories
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter GitHub username — e.g. MAZahid96"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={searchUser}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Searching GitHub...</p>
          </div>
        )}

        {user && !loading && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex gap-6 items-start">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-24 h-24 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {user.name || user.login}
                      </h2>
                      <p className="text-blue-600 text-sm">@{user.login}</p>
                    </div>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      View on GitHub
                    </a>
                  </div>
                  {user.bio && (
                    <p className="text-gray-600 text-sm mt-2">{user.bio}</p>
                  )}
                  <div className="flex gap-4 mt-3 flex-wrap">
                    {user.location && (
                      <span className="text-xs text-gray-500">
                        📍 {user.location}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      📅 Joined {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {user.public_repos}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Repositories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {user.followers}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {user.following}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Following</p>
                </div>
              </div>
            </div>

            {repos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Latest Repositories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-blue-400 hover:shadow-md transition-all block"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {repo.name}
                        </h4>
                        {repo.language && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${languageColor[repo.language] || "bg-gray-100 text-gray-600"}`}
                          >
                            {repo.language}
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-gray-500 mb-3">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!user && !loading && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">Search for a GitHub user</p>
            <p className="text-sm mt-1">
              Try searching for{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setUsername("MAZahid96")}
              >
                MAZahid96
              </span>{" "}
              or{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setUsername("torvalds")}
              >
                torvalds
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
