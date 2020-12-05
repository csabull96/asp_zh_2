using Microsoft.EntityFrameworkCore.Migrations;

namespace ChatAppBackEnd.Migrations
{
    public partial class message_extended_with_username : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "ChatMessages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "ChatMessages");
        }
    }
}
