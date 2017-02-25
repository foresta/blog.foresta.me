
export default class SocialShare 
{
    coustructor(){
    }

    attach(btn) {

        // TODO::シェア数を表示する
        const siteUrl = btn.dataset.url
        const service = btn.dataset.service

        var serviceUrl = ""
        if (service == "facebook") {
            serviceUrl = 'https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(siteUrl)
        }
        if (service == "twitter") {
            serviceUrl = 'https://twitter.com/share?url=' + encodeURIComponent(siteUrl)
        }
        if (service == "pocket") {
            serviceUrl = 'http://getpocket.com/edit?url=' + encodeURIComponent(siteUrl)
        }
        if (service == "hatebu") {
            serviceUrl = 'http://b.hatena.ne.jp/entry/https://' + siteUrl
        }

        btn.addEventListener("click", (e) => {
            this.open(serviceUrl)
            return false
        })
    }

    open(url)
    {
        window.open(url,"_blank")
        return false;
    }
}
