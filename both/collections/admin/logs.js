this.Logs = new Meteor.Collection("log");

if (Meteor.isClient) {
    logsPagination = new Paginator(Logs);
}