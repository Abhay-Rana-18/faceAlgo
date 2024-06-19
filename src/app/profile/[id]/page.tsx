import User from "../../components/profile"
export default function({params}) {
    return (
        <>
            <User id={params.id} />
        </>
    )
}