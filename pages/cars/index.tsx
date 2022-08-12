import Link from "next/link";

const Hello = () => {
    return (
        <div>
            <h1>Cars</h1>
            <ul>
                <li>
                    <Link href={'/cars/Toyota'} >
                        <a>Toyota</a>
                    </Link>
                </li>
                <br></br>
                <li>
                    <Link href={'/cars/BMW'} >
                        <a>BMW</a>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Hello;