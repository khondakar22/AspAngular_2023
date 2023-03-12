using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rk.Webapi.Data.Migrations
{
    public partial class AddedIsRejected : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "Photos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "Photos");
        }
    }
}
