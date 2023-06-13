export default function viewResponseHandler(res) {
    return (err, html) => {
        if (err) {
            throw new Error(err);
        } else {
            res.send(html);
        }
    }
}