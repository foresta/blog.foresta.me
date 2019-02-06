
export default class SocialShare 
{
    coustructor(){
    }

    attach(btn) {

        // TODO::シェア数を表示する
        const siteUrl = btn.dataset.url
        const service = btn.dataset.service
        const title   = btn.dataset.title

        var serviceUrl = ""
        if (service == "facebook") {
            serviceUrl = 'https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(siteUrl)
        }
        if (service == "twitter") {
            serviceUrl = 'https://twitter.com/share?url=' + encodeURIComponent(siteUrl) + '&text=' + encodeURIComponent(title)
        }
        if (service == "pocket") {
            serviceUrl = 'http://getpocket.com/edit?url=' + encodeURIComponent(siteUrl)
        }
        if (service == "hatebu") {
            serviceUrl = 'http://b.hatena.ne.jp/entry/' + siteUrl
        }

        btn.addEventListener("click", (e) => {
            this.open(serviceUrl, service)
            return false
        })
    }

    open(url, service)
    {
        window.open(url, service + 'シェア', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=600, height=350');
        return false;
    }
}
