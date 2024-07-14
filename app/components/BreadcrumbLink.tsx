import {NavLink} from '@remix-run/react'

const BreadcrumbLink = ({path, name, isLastItem}: { path: string, name: string, isLastItem: boolean }) => {

    return (
        isLastItem ?
            <p>{name}</p>
            :
            <NavLink to={path}>{name}</NavLink>
    )
}

export default BreadcrumbLink