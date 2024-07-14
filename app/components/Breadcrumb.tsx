import {useMatches} from "@remix-run/react";
import MatchData from "~/types/match-data.interface";
import BreadcrumbLink from "~/components/BreadcrumbLink";

const Breadcrumb = () => {
    const homepageName = 'Home';
    const matches = useMatches();

    const lastMatch = matches[matches.length - 1];
    const breadcrumbs = (lastMatch.data as MatchData)?.breadcrumbs;

    const showBreadcrumb = breadcrumbs ? breadcrumbs[1].name !== homepageName : false;

    return (
        <>
            {(breadcrumbs && showBreadcrumb) &&
            <nav className={"h-8 bg-amber-400"} aria-label="breadcrumb">


                    <ol className={"flex gap-3"}>
                        {breadcrumbs.map((breadcrumb, index: number) => {

                                const itemURLObj = breadcrumb.item && new URL(breadcrumb.item)
                                const relPath = itemURLObj ? itemURLObj.pathname : "#"

                                return (
                                    <li key={index}>
                                        <BreadcrumbLink
                                            path={relPath}
                                            name={breadcrumb.name}
                                            isLastItem={index === breadcrumbs.length - 1}
                                        />
                                    </li>
                                )
                            }
                        )}
                    </ol>
            </nav>
                }
    </>

    );
}

export default Breadcrumb;
