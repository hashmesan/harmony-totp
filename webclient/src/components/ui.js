import { css, jsx } from '@emotion/react'

export function OTPInput(props) {
    return <input {...props} css={css`
    width:250px;margin:0 auto;margin-top: 150px;padding: 20px;background: #f5f5f5;border: 1px solid #d4d4d4;height: 150px;
  `}/>
}