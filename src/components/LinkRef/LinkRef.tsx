import {forwardRef} from 'react'
import {Link} from '@tanstack/react-router'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LinkRef = forwardRef<HTMLAnchorElement, any>((props, ref) =>
	<Link role={undefined} ref={ref} {...props} />
)

