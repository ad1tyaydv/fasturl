export default function LiveOn() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">
        Featured On
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <a
          href="https://startupfa.st"
          target="_blank"
          rel="noopener noreferrer"
          title="Powered by Startup Fast"
        >
          <img
            src="https://startupfa.st/images/badges/powered-by-light.svg"
            alt="Powered by Startup Fast"
            className="block dark:hidden w-[200px] h-auto"
          />
          <img
            src="https://startupfa.st/images/badges/powered-by-dark.svg"
            alt="Powered by Startup Fast"
            className="hidden dark:block w-[200px] h-auto"
          />
        </a>

        <a
          href="https://wired.business"
          target="_blank"
          rel="noopener noreferrer"
          title="Featured on Wired Business"
        >
          <img
            src="https://wired.business/badge0-white.svg"
            alt="Featured on Wired Business"
            className="block dark:hidden w-[240px] h-auto"
          />
          <img
            src="https://wired.business/badge0-dark.svg"
            alt="Featured on Wired Business"
            className="hidden dark:block w-[240px] h-auto"
          />
        </a>

        <a
          href="https://submitaitools.org"
          target="_blank"
          rel="noopener noreferrer"
          title="Submit AI Tools"
        >
          <img
            src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
            alt="Submit AI Tools"
            className="w-[220px] h-[66px] rounded-lg"
          />
        </a>
      </div>
    </div>
  );
}