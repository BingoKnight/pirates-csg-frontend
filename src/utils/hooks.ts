import { useLocation, useNavigate } from "react-router-dom";

export function useStatefulNavigate(): CallableFunction {
    const navigate = useNavigate()
    const location = useLocation()

    function statefulNavigate(to: string | number, replace?: boolean): void {
        if(typeof to === 'string') {
            const { from } = location.state || { from: '/' }
            const options = {
                state: {
                    // Prevent redirecting back to same page
                    from: location.pathname === to ? from : location.pathname
                },
                replace
            }
            
            navigate(to, options)
        } else {
            navigate(to)
        }
        return
    }

    return statefulNavigate
}

