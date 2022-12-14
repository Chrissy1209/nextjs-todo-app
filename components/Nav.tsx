import Link from "next/link";
import styles from '../style/Nav.module.css'

const Nav = () => {
    return (
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href={'/'}>Home</Link>
          </li>
          <li>
            <Link href={'/hola'}>Hola</Link>
          </li>
          <li>
            <Link href={'/cars'}>Car</Link>
          </li>
        </ul>
      </nav>
    )
}
export default Nav;