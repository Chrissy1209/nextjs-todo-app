import { useRouter } from "next/router";
import Link from "next/link";

const Item = () => {
    const rotue = useRouter()
    const { id } = rotue.query

    return (
        <div>       
          <Link href={'/'}>
            <a style={{width: "100%"}}>＜ Back</a>
          </Link>
          <h3 style={{paddingLeft: "50px"}}>記得要{id}！</h3>
        </div>
    )
}
export default Item;
