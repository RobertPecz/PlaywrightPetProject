import { console } from "inspector";

class HeaderHelper {
    getHeaderPagination(response: Object) {
        const a = response['_headers']['_headersArray'];
        const b = Object.keys(a).filter((element) => typeof element === 'string' && (element as string).includes('name')); //name?
    }
}

export default HeaderHelper;