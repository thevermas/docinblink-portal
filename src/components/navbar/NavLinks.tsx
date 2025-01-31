import { Link } from "react-router-dom";

interface NavLinksProps {
  isMobile?: boolean;
}

const NavLinks = ({ isMobile = false }: NavLinksProps) => {
  const links = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/services", text: "Services" },
    { to: "/contact", text: "Contact" },
  ];

  if (isMobile) {
    return (
      <>
        {links.map(({ to, text }) => (
          <Link
            key={to}
            to={to}
            className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
          >
            {text}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map(({ to, text }) => (
        <Link
          key={to}
          to={to}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          {text}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;