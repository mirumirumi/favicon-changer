interface Props {
  size?: string
  color?: string
}

export const LoadSpinner = ({ size = "100%", color = "#8b8b8b" }: Props) => {
  return (
    <svg
      height={size}
      viewBox="-4 -4 45 45"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      className="absolute inset-0 m-auto animate-spin"
    >
      <title>loading</title>
      <g fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="4.5">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke={color} />
        <path d="M36 18c0-9.94-8.06-18-18-18" />
      </g>
    </svg>
  )
}
