import Responses from './Responses';
export default function SendResponse(ident: string) {
  return Responses.find((response) => response.ident === ident);
}
