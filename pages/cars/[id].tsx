import { useRouter } from "next/router";

const CarsId = () => {
    const rotue = useRouter()
    const { id } = rotue.query

    return <h1>Hola {id}</h1>
}
export default CarsId;