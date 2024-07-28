import User from "../../components/profile"
export default function({params}:any) {
    return (
        <>
            <User id={params.id} />
        </>
    )
}