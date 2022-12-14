import { useLocation, useNavigate } from "react-router-dom";

export function useStatefulNavigate(): CallableFunction {
    const navigate = useNavigate()
    const location = useLocation()

    function statefulNavigate(to: string | number, replace?: boolean): void {
        console.log(`to: ${to}`)
        if(typeof to === 'string') {
            const options = {
                state: {
                    from: location.pathname
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

