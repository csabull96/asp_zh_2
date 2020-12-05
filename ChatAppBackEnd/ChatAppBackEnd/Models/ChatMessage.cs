using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAppBackEnd.Models
{
    public class ChatMessage
    {
        [Key]
        public string Id { get; set; }

        public string Text { get; set; }

        public virtual ChatRoom ChatRoom { get; set; }

        public string Username { get; set; }

        public DateTime Created { get; set; }
    }
}
