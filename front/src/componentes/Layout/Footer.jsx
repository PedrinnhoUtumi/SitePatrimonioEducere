import React from "react";

export function Footer({
    github = "https://github.com/brunpena",
    githubPedro = "https://github.com/PedrinnhoUtumi",
    githubSara = "https://github.com/saraqwe123",
    foundationName = "Fundação Educere",
}) {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 w-full">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="text-center md:text-left">
                    <div className="text-sm font-semibold text-gray-100">{foundationName}</div>
                    <div className="text-xs text-gray-400">© {year} — Todos os direitos reservados.</div>
                </div>

                <div className="flex items-center flex-wrap gap-3 justify-center">
                    <span className="text-xs text-gray-400 hidden sm:inline">Desenvolvido por</span>

                    <a
                        href={githubSara}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-gray-800/50 hover:bg-gray-800/70 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Abrir GitHub de saraqwe123`}
                    >
                        <span className="font-mono text-sm text-indigo-300">&lt;saraqwe123/&gt;</span>
                        <GitHubIcon />
                    </a>

                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-gray-800/50 hover:bg-gray-800/70 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Abrir GitHub de brunpena`}
                    >
                        <span className="font-mono text-sm text-indigo-300">&lt;brunpena/&gt;</span>
                        <GitHubIcon />
                    </a>

                    <a
                        href={githubPedro}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-gray-800/50 hover:bg-gray-800/70 transition-shadow shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Abrir GitHub de PedrinnhoUtumi`}
                    >
                        <span className="font-mono text-sm text-indigo-300">&lt;PedrinnhoUtumi/&gt;</span>
                        <GitHubIcon />
                    </a>
                </div>
            </div>
        </footer>
    );
}

function GitHubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.72 1.27 3.38.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11.06 11.06 0 012.9-.39c.99.01 1.99.13 2.92.39 2.2-1.5 3.17-1.18 3.17-1.18.63 1.57.23 2.73.12 3.02.75.8 1.2 1.82 1.2 3.07 0 4.39-2.69 5.35-5.25 5.63.42.36.79 1.08.79 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.73 18.27.5 12 .5z"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    );
}
