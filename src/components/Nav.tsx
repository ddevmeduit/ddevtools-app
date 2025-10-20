import { Link, useLocation } from "react-router-dom"


export const DFPS_ROUTE = "/"
export const DBPS_ROUTE = "/dbps"
export const DMRS_ROUTE = "/dmrs"
export const FILE_CHECKER_ROUTE = "/file-checker"
export const STATEMENT_BUILDER_ROUTE = "/statement-builder"

const navItems = [
    { to: DFPS_ROUTE, value: "DFPS" },
    { to: DBPS_ROUTE, value: "DBPS" },
    { to: DMRS_ROUTE, value: "DMRS" },
    { to: FILE_CHECKER_ROUTE, value: "File Checker" },
    { to: STATEMENT_BUILDER_ROUTE, value: "Statement Builder"}
]

const Nav = () => {
    const location = useLocation()

    return (
        <header className="flex my-3">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex gap-x-12">
                    {
                        navItems.map(item => (
                            <Link
                                to={item.to}
                                key={item.to}
                                className={`${location.pathname === item.to ? "underline" : ""}`}
                            >{item.value}</Link>
                        ))
                    }
                </div>
            </nav>
        </header>
    )
}

export default Nav