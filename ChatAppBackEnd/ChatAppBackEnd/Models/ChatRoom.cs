using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppBackEnd.Models
{
    public class ChatRoom
    {
        [Key]
        public string Id { get; set; }

        public string Name { get; set; }

        public virtual ICollection<ChatMessage> Messages { get; set; }

        public DateTime Created { get; set; }
    }
}
