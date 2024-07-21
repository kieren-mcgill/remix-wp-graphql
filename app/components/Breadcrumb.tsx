import {useMatches} from "@remix-run/react";
import BreadcrumbLink from "~/components/BreadcrumbLink";

const Breadcrumb = () => {
    const matches = useMatches();

    const lastMatch = matches[matches.length - 1];
    const breadcrumbs = lastMatch.data?.seo.breadcrumbs;

    const showBreadcrumb = breadcrumbs ? breadcrumbs.length > 1 : false;

    return (
        <>
            {(breadcrumbs && showBreadcrumb) &&
            <nav className={"h-8 bg-amber-400"} aria-label="breadcrumb">

                    <ol className={"flex gap-3"}>
                        {breadcrumbs.map((breadcrumb, index: number) => {

                                const itemURLObj = breadcrumb.url && new URL(breadcrumb.url)
                                const relPath = itemURLObj ? itemURLObj.pathname : "#"

                                return (
                                    <li key={index}>
                                        <BreadcrumbLink
                                            path={relPath}
                                            name={breadcrumb.text}
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
