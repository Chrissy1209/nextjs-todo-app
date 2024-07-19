import Link from "next/link";
import styles from "../styles/Nav.module.scss";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/calculator"}>Calculator</Link>
        </li>
        <li>
          <Link href={"/cars"}>Car</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Nav;
