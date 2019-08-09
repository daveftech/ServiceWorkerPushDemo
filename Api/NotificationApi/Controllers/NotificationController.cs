using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using WebPush;

namespace NotificationApi.Controllers
{
    //    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*", SupportsCredentials = true)]
    [EnableCors(origins: "http://localhost:56461", headers: "*", methods: "*", SupportsCredentials = true)]
    public class NotificationController : ApiController
    {
        public string PrivateKey = "_wCPAfUwOiZfAW20zZMC8rkvfIzw2I8MStH78gHtODk";
        public string PublicKey = "BHAqnUp5ZgkrT6ZrHTnFCYQOz9A2fWOrBVT38PFpgwTcH5g9Eh1WOYWgRMGilDImhfq_lqii9wBIN3YdKw0GUrU";


        public static List<PushSubscription> Subscriptions { get; set; } = new List<PushSubscription>();

        [HttpPost]
        [Route("Notification/Subscribe")]
        public IHttpActionResult Subscribe([FromBody] PushSubscription sub)
        {
            var foundSub = Subscriptions.FirstOrDefault(x => x.Endpoint == sub.Endpoint);

            if (foundSub == null)
            {

                Subscriptions.Add(sub);
            }

            return Ok($"Subscribed {sub.Endpoint}");
        }

        [HttpPost]
        [Route("Notification/Unsubscribe")]
        public IHttpActionResult Unsubscribe([FromBody] PushSubscription sub)
        {
            var foundSub = Subscriptions.FirstOrDefault(x => x.Endpoint == sub.Endpoint);

            if (foundSub != null)
            {
                Subscriptions.Remove(foundSub);
            }

            return Ok();
        }

        [HttpPost]
        [Route("Notification/Broadcast")]
        public IHttpActionResult Broadcast([FromBody] NotificationModel message)
        {
            var subject = @"mailto:mkshymensky@winnipeg.ca";
            var publicKey = @"BK3vYfoTOx1UvUwVGyzjUA6enowrUmvGvuGZobkBFoaKNJOt20Yr2BHEWJDUGoJx0_F4qifnyVkr7VGqVch8PHU";
            var privateKey = @"opztxU7QKN-MNpXmbQd5KKMUmx97MItsTIZZrQR9ojA";

            var client = new WebPushClient();
            var serializedMessage = JsonConvert.SerializeObject(message);

            List<string> invalidEndpoints = new List<string>();


            foreach (var pushSubscription in Subscriptions)
            {
                try
                {
                    client.SendNotification(pushSubscription, serializedMessage, new VapidDetails { Subject = subject, PublicKey = publicKey, PrivateKey = privateKey });
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Exception while sending notification.  Exception: {ex}");

                    //this is mostly going to nuke old notifications, so clea it up afterwards
                    invalidEndpoints.Add(pushSubscription.Endpoint);
                }
            }

            foreach(var endPoint in invalidEndpoints)
            {
                var foundSub = Subscriptions.FirstOrDefault(x => x.Endpoint == endPoint);

                if (foundSub != null)
                {
                    Subscriptions.Remove(foundSub);
                }
            }

            return Ok();
        }
    }
}