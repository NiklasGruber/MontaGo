namespace MontagGo.API.DbModels
{
    public class Orders
    {
        public int Id { get; set; }
        public string Typ { get; set; }         // "Montage" oder "Service"
        public string Beschreibung { get; set; }
        public DateTime Startdatum { get; set; }
        public int DauerTage { get; set; }
    }
}
